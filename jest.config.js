// Define the env variables our code expects
process.env = Object.assign(process.env, {
  SECRET: "test-secret",
  JWT_AUDIENCE: "http://localhost",
  JWT_ISSUER: "http://localhost",
  JWT_EXPIRES_IN: "1h",
});

module.exports = {
  bail: 1,
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
};
