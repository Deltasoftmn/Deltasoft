module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 5 * 1024 * 1024, // 5MB
    },
  },
});
