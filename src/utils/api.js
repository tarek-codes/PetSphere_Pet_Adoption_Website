import axios from 'axios';

/**
 * API Base URL resolution:
 * - If VITE_API_URL is explicitly set (e.g. during local dev or pointing to an external backend), use it.
 * - In production on Vercel without VITE_API_URL, fallback to window.location.origin (relative same-origin).
 * - In dev mode without VITE_API_URL, fallback to 'http://localhost:3000'.
 */
const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl !== undefined && envUrl !== '') {
        return envUrl.replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        // If in development mode (e.g. Vite dev server on port 5173), default to localhost:3000
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        // In production on Vercel, requests use same origin (relative)
        return window.location.origin;
    }
    return 'http://localhost:3000';
};

export const API_BASE_URL = getBaseUrl();

/**
 * Helper to build an absolute or relative endpoint URL
 * @param {string} path 
 * @returns {string}
 */
export const apiUrl = (path = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Pre-configured Axios instance with credentials enabled
 */
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
