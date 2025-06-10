export default {
  clearMocks: true,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
};
