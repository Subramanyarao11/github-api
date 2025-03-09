export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  github: {
    token: process.env.GITHUB_TOKEN,
    username: process.env.GITHUB_USERNAME,
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT) || 10,
  },
  cache: {
    ttl: 60 * 5,
  },
});
