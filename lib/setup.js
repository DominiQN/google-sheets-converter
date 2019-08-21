const homedir = require('os').homedir();
const fs = require('fs-extra');
const { Readline, chalk, prettifyDirectoryPath } = require('./common-utils');

const DEFAULT_CREDENTIALS_PATH = homedir;
const DEFAULT_TOKEN_PATH = homedir;
const GOOGLE_CREDENTIALS_FILE_NAME = 'google-credentials.json';
const GOOGLE_OAUTH2_TOKEN_FILE_NAME = 'google-oauth2-token.json';
const CONFIG_FILE_NAME = 'sheets-config.json';

exports.DEFAULT_CREDENTIALS_PATH = DEFAULT_CREDENTIALS_PATH;
exports.DEFAULT_TOKEN_PATH = DEFAULT_TOKEN_PATH;
exports.GOOGLE_CREDENTIALS_FILE_NAME = GOOGLE_CREDENTIALS_FILE_NAME;
exports.GOOGLE_OAUTH2_TOKEN_FILE_NAME = GOOGLE_OAUTH2_TOKEN_FILE_NAME;
exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;


let configPath;
let rl = new Readline();

exports.setup = async function setup(options) {
  const config = {};

  try {
    await setPath(options);

    config.spreadsheetId = await setSpreadsheetId();

    config.credentialsPath = await setCredentialsPath();

    config.tokenPath = await setTokenPath();

    config.destinationDir = await setDestinationDir();

    await fs.mkdir(configPath, { recursive: true });
    await fs.writeFile(`${configPath}/${CONFIG_FILE_NAME}`, JSON.stringify(config, null, 2));

    rl.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function setPath(options) {
  if (options.config) {
    console.log(chalk(`path to create config: ${options.config}`))
  } else {
    configPath = prettifyDirectoryPath(await rl.question('Path to create config file: '));
    if (!configPath) {
      // TODO: https://stackoverflow.com/questions/56029414/prevent-empty-lines-from-output-in-node-readline
      console.log(chalk('path not exist'));
      console.log(chalk(`set the default path: ${homedir}/${CONFIG_FILE_NAME}`))
    }
  }
}

async function setSpreadsheetId() {
  return await rl.question(`Google Spreadsheet ID: `);
}

async function setCredentialsPath() {
  return await rl.question(`Google credentials' directory path(file name: ${GOOGLE_CREDENTIALS_FILE_NAME}): `);
}

async function setTokenPath() {
  return await rl.question(`Directory path to save google oauth2 token (file name: ${GOOGLE_OAUTH2_TOKEN_FILE_NAME}): `)
}

async function setDestinationDir() {
  return await rl.question(`Destination directory path: `);
}