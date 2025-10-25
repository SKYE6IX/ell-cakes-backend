import type { Config } from "jest";

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  testEnvironment: "node",

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  setupFiles: ["./jest.setup.ts"],
};

export default config;
