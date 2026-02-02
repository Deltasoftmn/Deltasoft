module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: ({ env }) => {
      const origins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
      const frontendUrl = env('FRONTEND_URL');
      if (frontendUrl) {
        origins.push(frontendUrl.replace(/\/$/, ''));
      }
      const extra = env('CORS_ORIGINS');
      if (extra) {
        extra.split(',').forEach((o) => o && origins.push(o.trim()));
      }
      return { origin: origins, credentials: true };
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
