import type { UserProfileData } from '../types';
import { getGistData, updateGistData } from './storageService';
import { isPersistenceConfigured } from '../config';

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
            // Merge with guest data to ensure new properties are added to old profiles
            return { ...guestProfileData, ...allData[arsisId] };
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
