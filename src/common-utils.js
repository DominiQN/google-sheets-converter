const c = require('chalk');
const readline = require('readline');

const chalk = c.blueBright;

exports.chalk = chalk;

exports.Readline = class Readline {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * @param {string} query
   * @returns {Promise<string>}
   */
  question(query) {
    return new Promise((resolve, reject) => {
      try {
        this.rl.question(chalk(query), (answer) => resolve(answer));
      } catch (error) {
        reject(error);
      }
    })
  }

  close() {
    this.rl.close();
  }
}

/**
 * Remove end character '/' or '\\' of given file path, and trim.
 * @param {string} filePath
 * @returns {string}
 */
exports.prettifyDirectoryPath = function prettifyDirectoryPath(filePath) {
  if (filePath.endsWith('/') || filePath.endsWith(`\\`)) {
    return filePath.slice(0, -1).trim();
  }
  return filePath.trim();
}