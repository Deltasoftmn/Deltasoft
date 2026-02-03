/**
 * Strapi API base URL.
 * - In production (Vercel): set REACT_APP_STRAPI_URL=https://admin.deltasoft.website in Vercel env
 * - In development: leave unset to use proxy (package.json proxy → localhost:1337)
 */
export const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || '';

/** News API path: default "newss" (admin.deltasoft.website). Set REACT_APP_STRAPI_NEWS_API=news if your Strapi uses /api/news */
export const STRAPI_NEWS_API = process.env.REACT_APP_STRAPI_NEWS_API || 'newss';

export function apiUrl(path) {
  const base = STRAPI_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

const ADMIN_JWT_KEY = 'strapi_admin_jwt';
const ADMIN_USER_KEY = 'strapi_admin_user';

export function getStrapiJwt() {
  return localStorage.getItem(ADMIN_JWT_KEY);
}

export function setStrapiAuth(jwt, user) {
  if (jwt) localStorage.setItem(ADMIN_JWT_KEY, jwt);
  else localStorage.removeItem(ADMIN_JWT_KEY);
  if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(ADMIN_USER_KEY);
}

export function clearStrapiAuth() {
  localStorage.removeItem(ADMIN_JWT_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getAuthHeaders() {
  const jwt = getStrapiJwt();
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

/** Authenticated fetch for admin: GET/POST/PUT/PATCH/DELETE with JWT */
export function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof Blob)) {
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }
  return fetch(url, { ...options, headers });
}
