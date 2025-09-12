
import type { UserProfileData, VFS, VFSDirectory } from '../types';
import { getGistData, updateGistData } from './storageService';
import { isPersistenceConfigured } from '../config';
import { createInitialVFS } from '../constants';

/**
 * Ensures a user's VFS has the default directories. Merges in any missing ones.
 * This is useful for migrating older user profiles.
 * @param userVfs The user's current VFS.
 * @returns The migrated VFS.
 */
const migrateVfs = (userVfs: VFS): VFS => {
    const defaultVfs = createInitialVFS();
    let migratedVfs = { ...userVfs };

    // Ensure top-level children object exists
    if (!migratedVfs.children) {
        migratedVfs.children = {};
    }

    // Check for and merge default directories if they don't exist
    for (const key in defaultVfs.children) {
        if (!migratedVfs.children[key]) {
            console.log(`Migrating VFS: Adding missing directory '/${key}' for user.`);
            migratedVfs.children[key] = defaultVfs.children[key];
        }
    }
    return migratedVfs;
};


/**
 * Logs in a user by fetching their data from the Gist. If the user doesn't exist,
 * a new profile is created for them. If persistence is not configured, it returns a guest profile.
 * @param arsisId The user's unique Arsis ID (username).
 * @param guestProfileData The default data for a new user.
 * @returns A promise that resolves with the user's profile data.
 */
export const loginOrCreateUser = async (
    arsisId: string,
    guestProfileData: UserProfileData
): Promise<UserProfileData> => {
    if (!isPersistenceConfigured) {
        console.log('Persistence not configured. Falling back to guest session for user:', arsisId);
        return guestProfileData;
    }

    try {
        console.log(`Attempting to log in or create user: ${arsisId}`);
        const allData = await getGistData();

        if (allData[arsisId]) {
            console.log(`User ${arsisId} found. Logging in.`);
            const userProfile = allData[arsisId];
            
            // Ensure VFS exists and has default folders for backward compatibility
            userProfile.vfs = migrateVfs(userProfile.vfs || createInitialVFS());

            // Merge with guest data to ensure new root properties are added to old profiles
            return { ...guestProfileData, ...userProfile };
        } else {
            console.log(`User ${arsisId} not found. Creating new profile.`);
            allData[arsisId] = guestProfileData;
            await updateGistData(allData);
            return guestProfileData;
        }
    } catch (error) {
        console.error("Failed to login or create user due to a storage error. Falling back to a temporary guest profile.", error);
        // If getGistData fails for any reason (network, config error), we fall back.
        return guestProfileData;
    }
};

/**
 * Creates a new user profile in the Gist storage if the ID doesn't already exist.
 * This is used for converting a guest session into a saved profile.
 * @param arsisId The new Arsis ID to create.
 * @param data The UserProfileData from the current guest session.
 * @returns A promise that resolves with a success status and an optional error message.
 */
export const createUser = async (arsisId: string, data: UserProfileData): Promise<{ success: boolean; error?: string }> => {
    if (!isPersistenceConfigured) {
        return { success: false, error: "Remote storage is not configured." };
    }

    try {
        const allData = await getGistData();
        if (allData[arsisId]) {
            return { success: false, error: `Arsis ID "${arsisId}" is already taken.` };
        }

        allData[arsisId] = data;
        await updateGistData(allData);
        return { success: true };
    } catch (error: any) {
        console.error(`Failed to create profile for ${arsisId}:`, error);
        return { success: false, error: error.message || "Could not connect to storage service." };
    }
};

/**
 * Saves the user's data to the Gist. Does nothing if persistence is not configured.
 * @param arsisId The Arsis ID of the logged-in user.
 * @param data The complete UserProfileData object to save.
 */
export const saveUserProfile = async (arsisId: string, data: UserProfileData): Promise<void> => {
    if (!isPersistenceConfigured) {
        return; // Do not attempt to save if persistence is not configured.
    }
    
    try {
        const allData = await getGistData();
        allData[arsisId] = data;
        await updateGistData(allData);
    } catch (error) {
        console.error(`Failed to save profile for ${arsisId}:`, error);
        // Potentially notify the user that saving failed.
    }
};
