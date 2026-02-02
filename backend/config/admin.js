module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'deltasoft-admin-secret-change-in-production'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'deltasoft-api-token-salt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'deltasoft-transfer-token-salt'),
    },
  },
  url: env('ADMIN_URL', '/admin'),
});
