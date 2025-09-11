// This file centralizes all environment variables for the application.
// In a real build process, these would be replaced by the build tool.

export const API_KEY = process.env.API_KEY || '';
export const GIST_ID = process.env.GIST_ID || '';
export const GITHUB_PAT = process.env.GITHUB_PAT || '';

/**
 * A flag to easily check if the remote persistence layer is configured.
 */
export const isPersistenceConfigured = !!(GIST_ID && GITHUB_PAT);

/**
 * A flag to easily check if the AI features are configured.
 */
export const isAiConfigured = !!API_KEY;
