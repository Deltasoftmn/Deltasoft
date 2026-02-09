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
const STRAPI_ROLE_KEY = 'strapi_login_role';

export function getStrapiJwt() {
  return localStorage.getItem(ADMIN_JWT_KEY);
}

export function setStrapiAuth(jwt, user, roleHint) {
  if (jwt) localStorage.setItem(ADMIN_JWT_KEY, jwt);
  else localStorage.removeItem(ADMIN_JWT_KEY);
  if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(ADMIN_USER_KEY);
  if (roleHint) localStorage.setItem(STRAPI_ROLE_KEY, roleHint);
  else localStorage.removeItem(STRAPI_ROLE_KEY);
}

export function clearStrapiAuth() {
  localStorage.removeItem(ADMIN_JWT_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(STRAPI_ROLE_KEY);
}

/** Parsed user object from localStorage (set after login). */
export function getStrapiUser() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Worker role ID from Strapi (optional). Set REACT_APP_STRAPI_WORKER_ROLE_ID if Strapi returns only role id. */
export const STRAPI_WORKER_ROLE_ID = process.env.REACT_APP_STRAPI_WORKER_ROLE_ID
  ? String(process.env.REACT_APP_STRAPI_WORKER_ROLE_ID).trim()
  : '';

/** True if user has Worker role (by role.name, role.id, stored role hint, or login mode). */
export function isWorkerUser(user) {
  const storedRole = localStorage.getItem(STRAPI_ROLE_KEY);
  if (storedRole && storedRole.toLowerCase() === 'worker') return true;
  if (!user) return false;
  const roleId = user.role?.id ?? user.role;
  if (STRAPI_WORKER_ROLE_ID && String(roleId) === STRAPI_WORKER_ROLE_ID) return true;
  const name = String(user.role?.name || user.role?.type || '').toLowerCase();
  return name.includes('worker') || name.includes('ажилтан');
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
  if (options.body != null && !headers['Content-Type']) {
    if (typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json';
    } else if (typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof Blob)) {
      headers['Content-Type'] = 'application/json';
    }
  }
  return fetch(url, { ...options, headers });
}
