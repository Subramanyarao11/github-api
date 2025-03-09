export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  github: {
    token: process.env.GITHUB_TOKEN,
    username: process.env.GITHUB_USERNAME,
  },
});
