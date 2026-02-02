/**
 * Strapi API base URL.
 * - In production (Vercel): set REACT_APP_STRAPI_URL=https://admin.deltasoft.website in Vercel env
 * - In development: leave unset to use proxy (package.json proxy → localhost:1337)
 */
export const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || '';

export function apiUrl(path) {
  const base = STRAPI_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
