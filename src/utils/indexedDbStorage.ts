import { Textbook, TEXTBOOKS } from '../data/textbooksData';

const DB_NAME = 'bozorcha_edu_db';
const DB_VERSION = 1;
const STORE_NAME = 'textbooks';

/**
 * Opens or initializes the IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Loads all textbooks with their full file data from IndexedDB
 */
export async function loadTextbooksFromIndexedDb(): Promise<Textbook[] | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as Textbook[];
        if (items && items.length > 0) {
          resolve(items);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.warn('Could not read textbooks from IndexedDB:', request.error);
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('IndexedDB open error:', err);
    return null;
  }
}

/**
 * Saves all textbooks (including large PDF / DOCX base64 data) safely to IndexedDB
 */
export async function saveTextbooksToIndexedDb(textbooks: Textbook[]): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      // Clear existing records and rewrite with latest list
      store.clear();

      for (const book of textbooks) {
        store.put(book);
      }

      tx.oncomplete = () => {
        resolve(true);
      };

      tx.onerror = () => {
        console.warn('IndexedDB write error:', tx.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('IndexedDB write failure:', err);
    return false;
  }
}

/**
 * Sanitizes textbooks list for localStorage to prevent QuotaExceededError
 * Strips heavy base64 fileData (> 100KB) from localStorage copy since IndexedDB holds the full file!
 */
export function sanitizeTextbooksForLocalStorage(textbooks: Textbook[]): Textbook[] {
  return textbooks.map((book) => {
    if (book.fileData && book.fileData.length > 100000) {
      // Keep metadata, replace fileData with placeholder indicator
      return {
        ...book,
        fileData: undefined, // Stripped from localStorage to avoid quota exceed
      };
    }
    return book;
  });
}
