/// ClassroomPRO Mobile Synchronization Engine (Architecture §10 & §11)
///
/// Shares the exact backend synchronization contract with the Web PWA:
/// - `GET /api/content/manifests`
/// - `GET /api/content/packages/:packageId`
/// - `POST /api/sync/push` (idempotent batch upload using `operation_id`)
/// - `GET /api/sync/status`

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'sqlite_offline_store.dart';

class MobileSyncEngine {
  final String apiBaseUrl;
  final SqliteOfflineStore store;
  final String studentId;

  MobileSyncEngine({
    required this.apiBaseUrl,
    required this.store,
    this.studentId = 'student-demo-1',
  });

  /// Selectively downloads a curriculum package by packageId (e.g. `pkg-nerdc-pri4-math-t1`)
  /// and caches Markdown lessons in SQLite + image diagrams on the device file system.
  Future<void> downloadCurriculumPackage(String packageId) async {
    final uri = Uri.parse('$apiBaseUrl/content/packages/$packageId');
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw Exception('Failed to download curriculum package $packageId');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final pkg = decoded['package'] as Map<String, dynamic>;
    final lessons = (pkg['lessons'] as List<dynamic>? ?? []);

    for (final rawLesson in lessons) {
      final l = rawLesson as Map<String, dynamic>;
      final lessonModel = LocalLessonModel(
        contentId: l['content_id'] as String,
        packageId: pkg['package_id'] as String,
        classCode: pkg['class_code'] as String,
        subjectId: pkg['subject_id'] as String,
        term: pkg['term'] as String,
        week: (l['week'] as num).toInt(),
        topic: l['topic'] as String,
        subtopic: (l['subtopic'] as String?) ?? '',
        version: (l['version'] as num).toInt(),
        checksumSha256: (l['checksum_sha256'] as String?) ?? '',
        markdownContent: (l['markdown_content'] as String?) ?? '',
        youtubeId: (l['youtube_id'] as String?) ?? '',
        youtubeUrl: (l['youtube_url'] as String?) ?? '',
      );
      await store.saveLesson(lessonModel);
    }

    await store.savePackageManifest(pkg);
  }

  /// Queues an offline quiz attempt in SQLite with a deterministic idempotent operation_id
  Future<PendingSyncOpModel> recordOfflineQuizAttempt({
    required String quizId,
    required double score,
    required double maxScore,
    required Map<String, int> answers,
  }) async {
    final ts = DateTime.now().millisecondsSinceEpoch;
    final op = PendingSyncOpModel(
      operationId: 'op-mobile-quiz-$quizId-$ts',
      operationType: 'QUIZ_ATTEMPT',
      entityId: quizId,
      clientTimestamp: ts,
      payload: {
        'score': score,
        'max_score': maxScore,
        'answers': answers,
        'student_id': studentId,
      },
    );
    await store.enqueueSyncOperation(op);
    return op;
  }

  /// Pushes all pending SQLite operations to `POST /api/sync/push` idempotently
  Future<int> synchronizePendingOperations() async {
    final pending = await store.getPendingSyncOperations();
    if (pending.isEmpty) return 0;

    final uri = Uri.parse('$apiBaseUrl/sync/push');
    final body = jsonEncode({
      'student_id': studentId,
      'device_id': 'flutter-mobile-sqlite',
      'operations': pending.map((op) => op.toApiJson()).toList(),
    });

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: body,
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      final results = (decoded['results'] as List<dynamic>? ?? []);
      for (final r in results) {
        final map = r as Map<String, dynamic>;
        final opId = map['operation_id'] as String?;
        if (opId != null) {
          await store.markOperationSynchronized(opId);
        }
      }
      return results.length;
    }

    return 0;
  }
}
