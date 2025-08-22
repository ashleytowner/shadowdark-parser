module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|js)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "^(.+)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
};
