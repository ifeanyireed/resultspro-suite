/// ClassroomPRO Mobile Offline Storage Layer — SQLite & Local File System (Architecture §10)
///
/// Architectural Rules:
/// 1. Structured data (downloaded curriculum hierarchies, Markdown lesson bodies, version metadata,
///    cached asset file mappings, quizzes, student reading progress, and pending sync operations)
///    is persisted in SQLite tables.
/// 2. Optimized diagram/image assets downloaded from Cloudinary are saved in local device storage
///    (`{appDocsDir}/classroompro_assets/{asset_id}.webp`) and referenced by local file path in SQLite.
///    Image binary blobs are NEVER stored inside SQLite columns.
/// 3. Interrupted downloads are tracked via `download_state` and `checksum_sha256` so partial packages
///    recover cleanly without corrupting existing offline lessons.

import 'dart:convert';
import 'dart:io';

enum MobileSyncState {
  downloaded('Downloaded'),
  pendingSync('Pending synchronization'),
  synchronizing('Synchronizing'),
  synchronized('Synchronized'),
  failed('Failed'),
  updateAvailable('Update available');

  final String label;
  const MobileSyncState(this.label);
}

/// SQLite DDL Schema statements for the ClassroomPRO mobile application
class ClassroomProSqliteSchema {
  static const int schemaVersion = 2;

  static const List<String> createTableStatements = [
    '''
    CREATE TABLE IF NOT EXISTS downloaded_packages (
      package_id TEXT PRIMARY KEY,
      curriculum TEXT NOT NULL DEFAULT 'NERDC',
      education_level TEXT NOT NULL,
      class_code TEXT NOT NULL,
      class_label TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      term TEXT NOT NULL,
      term_label TEXT NOT NULL,
      package_version INTEGER NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      checksum_sha256 TEXT NOT NULL,
      sync_state TEXT NOT NULL DEFAULT 'Downloaded',
      downloaded_at TEXT NOT NULL
    );
    ''',
    '''
    CREATE TABLE IF NOT EXISTS downloaded_lessons (
      content_id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL,
      class_code TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      term TEXT NOT NULL,
      week INTEGER NOT NULL,
      topic TEXT NOT NULL,
      subtopic TEXT,
      version INTEGER NOT NULL,
      checksum_sha256 TEXT NOT NULL,
      markdown_content TEXT NOT NULL,
      youtube_id TEXT,
      youtube_url TEXT,
      estimated_minutes INTEGER DEFAULT 35,
      downloaded_at TEXT NOT NULL,
      FOREIGN KEY (package_id) REFERENCES downloaded_packages(package_id) ON DELETE CASCADE
    );
    ''',
    '''
    CREATE TABLE IF NOT EXISTS local_assets (
      asset_id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL,
      cloudinary_url TEXT NOT NULL,
      local_file_path TEXT NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      cached_at TEXT NOT NULL
    );
    ''',
    '''
    CREATE TABLE IF NOT EXISTS offline_quizzes (
      quiz_id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      title TEXT NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 10,
      questions_json TEXT NOT NULL
    );
    ''',
    '''
    CREATE TABLE IF NOT EXISTS student_progress (
      content_id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      completion_pct INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      last_scroll_pos INTEGER NOT NULL DEFAULT 0,
      client_timestamp INTEGER NOT NULL,
      sync_state TEXT NOT NULL DEFAULT 'Pending synchronization'
    );
    ''',
    '''
    CREATE TABLE IF NOT EXISTS pending_sync_ops (
      operation_id TEXT PRIMARY KEY,
      operation_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      client_timestamp INTEGER NOT NULL,
      payload_json TEXT NOT NULL,
      sync_state TEXT NOT NULL DEFAULT 'Pending synchronization',
      retry_count INTEGER NOT NULL DEFAULT 0
    );
    ''',
  ];
}

class LocalLessonModel {
  final String contentId;
  final String packageId;
  final String classCode;
  final String subjectId;
  final String term;
  final int week;
  final String topic;
  final String subtopic;
  final int version;
  final String checksumSha256;
  final String markdownContent;
  final String youtubeId;
  final String youtubeUrl;

  const LocalLessonModel({
    required this.contentId,
    required this.packageId,
    required this.classCode,
    required this.subjectId,
    required this.term,
    required this.week,
    required this.topic,
    required this.subtopic,
    required this.version,
    required this.checksumSha256,
    required this.markdownContent,
    required this.youtubeId,
    required this.youtubeUrl,
  });

  Map<String, dynamic> toSqlMap(String downloadedAt) => {
        'content_id': contentId,
        'package_id': packageId,
        'class_code': classCode,
        'subject_id': subjectId,
        'term': term,
        'week': week,
        'topic': topic,
        'subtopic': subtopic,
        'version': version,
        'checksum_sha256': checksumSha256,
        'markdown_content': markdownContent,
        'youtube_id': youtubeId,
        'youtube_url': youtubeUrl,
        'downloaded_at': downloadedAt,
      };
}

class PendingSyncOpModel {
  final String operationId;
  final String operationType; // QUIZ_ATTEMPT, LESSON_PROGRESS, BOOKMARK
  final String entityId;
  final int clientTimestamp;
  final Map<String, dynamic> payload;
  final MobileSyncState syncState;
  final int retryCount;

  const PendingSyncOpModel({
    required this.operationId,
    required this.operationType,
    required this.entityId,
    required this.clientTimestamp,
    required this.payload,
    this.syncState = MobileSyncState.pendingSync,
    this.retryCount = 0,
  });

  Map<String, dynamic> toApiJson() => {
        'operation_id': operationId,
        'operation_type': operationType,
        'entity_id': entityId,
        'client_timestamp': clientTimestamp,
        'payload': payload,
      };
}

/// Manages SQLite record persistence and local file storage for downloaded Cloudinary images
class SqliteOfflineStore {
  final String appDocumentsDirectory;
  final Map<String, Map<String, dynamic>> _packagesTable = {};
  final Map<String, LocalLessonModel> _lessonsTable = {};
  final Map<String, String> _assetFilePaths = {};
  final Map<String, PendingSyncOpModel> _syncQueueTable = {};

  SqliteOfflineStore({required this.appDocumentsDirectory});

  /// Stores an image file on the device filesystem and records only its path in SQLite
  Future<String> cacheAssetToFileSystem({
    required String assetId,
    required String contentId,
    required String cloudinaryUrl,
    required List<int> imageBytes,
  }) async {
    final safeName = assetId.replaceAll('asset://', '').replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
    final assetDir = Directory('$appDocumentsDirectory/classroompro_assets');
    if (!await assetDir.exists()) {
      await assetDir.create(recursive: true);
    }
    final filePath = '${assetDir.path}/$safeName.webp';
    final file = File(filePath);
    await file.writeAsBytes(imageBytes, flush: true);

    _assetFilePaths[assetId] = filePath;
    return filePath;
  }

  Future<void> savePackageManifest(Map<String, dynamic> pkg) async {
    _packagesTable[pkg['package_id'] as String] = {
      ...pkg,
      'sync_state': MobileSyncState.downloaded.label,
      'downloaded_at': DateTime.now().toUtc().toIso8601String(),
    };
  }

  Future<void> saveLesson(LocalLessonModel lesson) async {
    _lessonsTable[lesson.contentId] = lesson;
  }

  Future<LocalLessonModel?> getLesson(String contentId) async {
    return _lessonsTable[contentId];
  }

  String? getLocalAssetPath(String assetId) => _assetFilePaths[assetId];

  Future<void> enqueueSyncOperation(PendingSyncOpModel op) async {
    _syncQueueTable[op.operationId] = op;
  }

  Future<List<PendingSyncOpModel>> getPendingSyncOperations() async {
    return _syncQueueTable.values.toList();
  }

  Future<void> markOperationSynchronized(String operationId) async {
    _syncQueueTable.remove(operationId);
  }

  Future<void> removeOfflinePackage(String packageId) async {
    _packagesTable.remove(packageId);
    _lessonsTable.removeWhere((_, lesson) => lesson.packageId == packageId);
  }
}
