
import type { UserProfileData } from '../types';

const DB_NAME = 'ArsisOS-GuestDB';
const STORE_NAME = 'userProfile';
const GUEST_KEY = 'guest_profile';

let db: IDBDatabase;

const openDb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject('Error opening database.');
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = () => {
            const dbInstance = request.result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME);
            }
        };
    });
};

export const saveGuestProfile = async (profile: UserProfileData): Promise<void> => {
    try {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(profile, GUEST_KEY);

            request.onsuccess = () => resolve();
            request.onerror = () => {
                console.error('Error saving guest profile:', request.error);
                reject('Could not save profile.');
            };
        });
    } catch (error) {
         console.error('Failed to save guest profile to IndexedDB', error);
         // Gracefully fail in environments where IndexedDB is not available (e.g., private browsing)
    }
};

export const getGuestProfile = async (): Promise<UserProfileData | null> => {
    try {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(GUEST_KEY);

            request.onsuccess = () => {
                resolve(request.result || null);
            };
            request.onerror = () => {
                console.error('Error getting guest profile:', request.error);
                reject('Could not retrieve profile.');
            };
        });
    } catch (error) {
        console.error('Failed to get guest profile from IndexedDB', error);
        return null; // Return null if DB can't be opened
    }
};

export const clearGuestProfile = async (): Promise<void> => {
    try {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(GUEST_KEY);

            request.onsuccess = () => resolve();
            request.onerror = () => {
                console.error('Error clearing guest profile:', request.error);
                reject('Could not clear profile.');
            };
        });
    } catch (error) {
         console.error('Failed to clear guest profile from IndexedDB', error);
    }
};
