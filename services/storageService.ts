import type { UserProfileData } from '../types';
import { GIST_ID, GITHUB_PAT, isPersistenceConfigured } from '../config';

const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;
const GIST_FILENAME = 'arsisOS.json';

/**
 * Fetches the entire dataset from the GitHub Gist.
 * @returns A promise that resolves with the parsed data object.
 */
export const getGistData = async (): Promise<Record<string, UserProfileData>> => {
    if (!isPersistenceConfigured) {
        console.warn("Storage service is not configured. This is expected if you are running in a test environment or have not set up a Gist backend.");
        throw new Error("Storage service is not configured.");
    }

    try {
        const response = await fetch(GIST_API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${GITHUB_PAT}`,
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const gist = await response.json();
        const file = gist.files[GIST_FILENAME];

        if (!file || !file.content) {
            console.warn(`${GIST_FILENAME} not found in Gist. Initializing new storage.`);
            return {};
        }

        return JSON.parse(file.content);
    } catch (error) {
        console.error("Failed to fetch Gist data:", error);
        throw new Error("Could not connect to the remote storage service.");
    }
};

/**
 * Updates the GitHub Gist with the new dataset.
 * @param data The complete data object to save.
 */
export const updateGistData = async (data: Record<string, UserProfileData>): Promise<void> => {
    if (!isPersistenceConfigured) {
        console.warn("Storage service is not configured. Skipping save operation.");
        return;
    }

    try {
        const response = await fetch(GIST_API_URL, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${GITHUB_PAT}`,
            },
            body: JSON.stringify({
                files: {
                    [GIST_FILENAME]: {
                        content: JSON.stringify(data, null, 2),
                    },
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        console.log("Gist data updated successfully.");
    } catch (error) {
        console.error("Failed to update Gist data:", error);
    }
};
