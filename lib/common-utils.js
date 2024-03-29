const c = require('chalk');
const readline = require('readline');
const homedir = require('os').homedir();

const chalkBlue = c.blueBright;

exports.chalk = chalkBlue;

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
        this.rl.question(query, (answer) => resolve(answer));
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

exports.homedir = homedir