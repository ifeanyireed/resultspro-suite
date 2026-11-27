/**
 * ClassroomPRO IndexedDB Structured Offline Database Engine v2
 * (Aligned with classroompro_study_packs_architecture.md §4.2 & §7.3)
 *
 * Stores all 5 Study Pack Modalities + Gamification Badges:
 * - packages: Downloaded Study Pack manifests, scheme-of-work spine, pricing, entitlement & sync states
 * - lessons: Portable Markdown lessons, resolved Markdown, version numbers, and linked YouTube metadata
 * - assets: Cached diagram images (Data URL / Blob metadata) mapped by asset://cld-* identifier
 * - videos: Linked YouTube video lectures + offline_summary_markdown for 100% offline study
 * - quizzes: Weekly formative practice quizzes & question banks
 * - flashcards: Offline spaced-repetition flashcard decks
 * - exams: Timed Mid-Term, Terminal & WAEC/JAMB/BECE CBT mock exams bundled in Study Packs
 * - badges: Study Pack Bronze/Silver/Gold achievement badges, unlock rules & earned status
 * - progress: Local student topic reading progress & completion timestamps
 * - bookmarks: Offline student bookmarks
 * - sync_queue: Pending upload operations (QUIZ_ATTEMPT, EXAM_ATTEMPT, BADGE_EARNED, LESSON_PROGRESS, BOOKMARK)
 */

export type SyncState =
  | 'Downloaded'
  | 'Pending synchronization'
  | 'Synchronizing'
  | 'Synchronized'
  | 'Failed'
  | 'Update available'
  | 'Revoked';

export interface SchemeWeekUnitRecord {
  week: number;
  topic_id: string;
  topic: string;
  subtopic: string;
  note_id: string;
  video_id: string;
  flashcard_ids: string[];
  quiz_id: string;
  exam_id?: string;
  badge_id?: string;
  is_preview?: boolean;
}

export interface OfflineLessonRecord {
  content_id: string;
  package_id: string;
  class_code: string;
  subject_id: string;
  term: string;
  week: number;
  topic: string;
  subtopic: string;
  version: number;
  checksum_sha256: string;
  markdown_content: string;
  resolved_markdown: string;
  assets: string[];
  resolved_assets: Record<string, string>;
  youtube_id: string;
  youtube_url: string;
  estimated_minutes: number;
  downloaded_at: string;
}

export interface OfflineAssetRecord {
  asset_id: string;
  delivery_url: string;
  data_url: string;
  alt: string;
  size_bytes: number;
  cached_at: string;
}

export interface OfflineVideoRecord {
  id: string;
  package_id: string;
  week: number;
  topic_id: string;
  title: string;
  instructor: string;
  youtube_id: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  summary: string;
  offline_summary_markdown: string;
  note_id?: string;
  quiz_id?: string;
  flashcard_set_id?: string;
}

export interface OfflineQuizRecord {
  id: string;
  package_id: string;
  topic_id: string;
  title: string;
  duration_min: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  }>;
}

export interface OfflineFlashcardRecord {
  id: string;
  package_id: string;
  topic_id: string;
  front: string;
  back: string;
  hint: string;
}

export interface OfflineExamRecord {
  id: string;
  package_id: string;
  week: number;
  exam_type: string; // MID_TERM_CBT | TERMINAL_MOCK | WAEC_MOCK | JAMB_CBT
  title: string;
  instructions: string;
  duration_min: number;
  pass_score_pct: number;
  sync_to_campuspro_component?: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  }>;
}

export interface OfflineBadgeRecord {
  badge_id: string;
  package_id: string;
  code: string;
  name: string;
  description: string;
  icon_svg_or_asset: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | string;
  xp_bonus: number;
  unlock_rule: Record<string, any>;
  earned?: boolean;
  earned_at?: string;
}

export interface OfflinePackageRecord {
  package_id: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  creator_name?: string;
  creator_role?: string;
  pricing_type?: 'FREE' | 'PAID' | string;
  price_kobo?: number;
  curriculum: string;
  education_level: string;
  class_code: string;
  class_label: string;
  subject_id: string;
  subject_name: string;
  term: string;
  term_label: string;
  package_version: number;
  server_version?: number;
  size_bytes: number;
  checksum_sha256: string;
  total_xp_reward?: number;
  scheme_of_work?: SchemeWeekUnitRecord[];
  lesson_ids: string[];
  video_ids?: string[];
  quiz_ids: string[];
  flashcard_ids: string[];
  exam_ids?: string[];
  badge_ids?: string[];
  license_type?: 'PERPETUAL' | string;
  entitlement_status?: 'ACTIVE' | 'REVOKED' | string;
  sync_state: SyncState;
  downloaded_at: string;
}

export interface OfflineProgressRecord {
  content_id: string;
  student_id: string;
  completion_pct: number;
  completed: boolean;
  last_scroll_pos: number;
  client_timestamp: number;
  sync_state: SyncState;
}

export interface PendingSyncOperation {
  operation_id: string;
  operation_type:
    | 'QUIZ_ATTEMPT'
    | 'EXAM_ATTEMPT'
    | 'BADGE_EARNED'
    | 'LESSON_PROGRESS'
    | 'BOOKMARK';
  entity_id: string;
  client_timestamp: number;
  payload: Record<string, any>;
  sync_state: SyncState;
  retry_count: number;
  last_error?: string;
}

const DB_NAME = 'classroompro_offline_db';
const DB_VERSION = 2;

function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('packages')) {
        db.createObjectStore('packages', { keyPath: 'package_id' });
      }
      if (!db.objectStoreNames.contains('lessons')) {
        const store = db.createObjectStore('lessons', { keyPath: 'content_id' });
        store.createIndex('by_package', 'package_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'asset_id' });
      }
      if (!db.objectStoreNames.contains('videos')) {
        const store = db.createObjectStore('videos', { keyPath: 'id' });
        store.createIndex('by_package', 'package_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('quizzes')) {
        const store = db.createObjectStore('quizzes', { keyPath: 'id' });
        store.createIndex('by_package', 'package_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('flashcards')) {
        const store = db.createObjectStore('flashcards', { keyPath: 'id' });
        store.createIndex('by_package', 'package_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('exams')) {
        const store = db.createObjectStore('exams', { keyPath: 'id' });
        store.createIndex('by_package', 'package_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('badges')) {
        const store = db.createObjectStore('badges', { keyPath: 'badge_id' });
        store.createIndex('by_package', 'package_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'content_id' });
      }
      if (!db.objectStoreNames.contains('bookmarks')) {
        db.createObjectStore('bookmarks', { keyPath: 'item_id' });
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'operation_id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putRecord<T>(storeName: string, record: T): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(record);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function getRecord<T>(storeName: string, key: string): Promise<T | null> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => {
      db.close();
      resolve((req.result as T) || null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function getAllRecords<T>(storeName: string): Promise<T[]> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => {
      db.close();
      resolve((req.result as T[]) || []);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function deleteRecord(storeName: string, key: string): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export const offlineDb = {
  savePackage: (pkg: OfflinePackageRecord) => putRecord('packages', pkg),
  getPackage: (packageId: string) => getRecord<OfflinePackageRecord>('packages', packageId),
  getAllPackages: () => getAllRecords<OfflinePackageRecord>('packages'),

  // Deletes a Study Pack and purges all 5 modalities (lessons, videos, quizzes, flashcards, exams) & unearned badges
  deletePackage: async (packageId: string) => {
    const pkg = await getRecord<OfflinePackageRecord>('packages', packageId);
    if (pkg) {
      for (const lid of pkg.lesson_ids || []) {
        await deleteRecord('lessons', lid);
      }
      for (const vid of pkg.video_ids || []) {
        await deleteRecord('videos', vid);
      }
      for (const qid of pkg.quiz_ids || []) {
        await deleteRecord('quizzes', qid);
      }
      for (const fid of pkg.flashcard_ids || []) {
        await deleteRecord('flashcards', fid);
      }
      for (const eid of pkg.exam_ids || []) {
        await deleteRecord('exams', eid);
      }
      for (const bid of pkg.badge_ids || []) {
        await deleteRecord('badges', bid);
      }
    }
    await deleteRecord('packages', packageId);
  },

  saveLesson: (lesson: OfflineLessonRecord) => putRecord('lessons', lesson),
  getLesson: (contentId: string) => getRecord<OfflineLessonRecord>('lessons', contentId),
  getAllLessons: () => getAllRecords<OfflineLessonRecord>('lessons'),

  saveAsset: (asset: OfflineAssetRecord) => putRecord('assets', asset),
  getAsset: (assetId: string) => getRecord<OfflineAssetRecord>('assets', assetId),
  getAllAssets: () => getAllRecords<OfflineAssetRecord>('assets'),

  saveVideo: (video: OfflineVideoRecord) => putRecord('videos', video),
  getVideo: (videoId: string) => getRecord<OfflineVideoRecord>('videos', videoId),
  getAllVideos: () => getAllRecords<OfflineVideoRecord>('videos'),

  saveQuiz: (quiz: OfflineQuizRecord) => putRecord('quizzes', quiz),
  getQuiz: (quizId: string) => getRecord<OfflineQuizRecord>('quizzes', quizId),
  getAllQuizzes: () => getAllRecords<OfflineQuizRecord>('quizzes'),

  saveFlashcard: (card: OfflineFlashcardRecord) => putRecord('flashcards', card),
  getAllFlashcards: () => getAllRecords<OfflineFlashcardRecord>('flashcards'),

  saveExam: (exam: OfflineExamRecord) => putRecord('exams', exam),
  getExam: (examId: string) => getRecord<OfflineExamRecord>('exams', examId),
  getAllExams: () => getAllRecords<OfflineExamRecord>('exams'),

  saveBadge: (badge: OfflineBadgeRecord) => putRecord('badges', badge),
  getBadge: (badgeId: string) => getRecord<OfflineBadgeRecord>('badges', badgeId),
  getAllBadges: () => getAllRecords<OfflineBadgeRecord>('badges'),

  saveProgress: (prog: OfflineProgressRecord) => putRecord('progress', prog),
  getProgress: (contentId: string) => getRecord<OfflineProgressRecord>('progress', contentId),
  getAllProgress: () => getAllRecords<OfflineProgressRecord>('progress'),

  enqueueSyncOp: (op: PendingSyncOperation) => putRecord('sync_queue', op),
  getSyncQueue: () => getAllRecords<PendingSyncOperation>('sync_queue'),
  removeSyncOp: (operationId: string) => deleteRecord('sync_queue', operationId),

  getStorageEstimateBytes: async (): Promise<number> => {
    const [pkgs, assets] = await Promise.all([
      getAllRecords<OfflinePackageRecord>('packages'),
      getAllRecords<OfflineAssetRecord>('assets'),
    ]);
    const pkgBytes = pkgs.reduce((acc, p) => acc + (p.size_bytes || 0), 0);
    const assetBytes = assets.reduce((acc, a) => acc + (a.size_bytes || 0), 0);
    return pkgBytes + assetBytes;
  },
};
