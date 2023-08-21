module.exports = {
  linters: {
    "package.json": ["npm run format:package", "git add"],
    ".editorconfig": ["prettier --write", "git add"],
    LICENSE: ["prettier --write", "git add"],
    "**/*.{json,md,yml}": ["prettier --write", "git add"],
    "**/*.js": ["prettier --write", "eslint --cache --fix", "git add"],
  },
  // The formatting tools are ordered to run sequentially
  concurrent: false,
}
