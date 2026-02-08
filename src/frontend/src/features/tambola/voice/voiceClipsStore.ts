// IndexedDB storage for host-recorded voice clips (1-90) - full numbers only

const DB_NAME = 'tambola-voice-clips';
const DB_VERSION = 1;
const STORE_NAME = 'clips';

interface ClipRecord {
  number: number;
  blob: Blob;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'number' });
      }
    };
  });
}

/**
 * Save a voice clip for a full number (1-90).
 * This should only be called for complete numbers, never for individual digits.
 */
export async function saveClip(number: number, blob: Blob): Promise<void> {
  if (number < 1 || number > 90) {
    throw new Error(`Invalid number ${number}: must be between 1 and 90`);
  }
  
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const record: ClipRecord = { number, blob, timestamp: Date.now() };
    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load a voice clip for a full number (1-90).
 * This should only be called for complete numbers, never for individual digits.
 */
export async function loadClip(number: number): Promise<Blob | null> {
  if (number < 1 || number > 90) {
    return null; // Invalid range, no clip available
  }
  
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(number);

    request.onsuccess = () => {
      const record = request.result as ClipRecord | undefined;
      resolve(record ? record.blob : null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteClip(number: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(number);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function listRecordedNumbers(): Promise<number[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAllKeys();

    request.onsuccess = () => {
      resolve(request.result as number[]);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function hasClip(number: number): Promise<boolean> {
  const clip = await loadClip(number);
  return clip !== null;
}
