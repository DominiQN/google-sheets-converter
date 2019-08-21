const fs = require('fs-extra');
const { Readline, chalk, prettifyDirectoryPath, homedir } = require('./common-utils');

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

const rl = new Readline();

exports.setup = async function setup() {
  const config = {};

  try {
    const configPath = await setConfigPath();

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

async function setConfigPath() {
  const configPath = prettifyDirectoryPath(await rl.question('Path to create config file(default: home dir of os): '));
  if (!configPath) {
    informSetDefaultPath();
    return homedir;
  }
  return configPath;
}

async function setSpreadsheetId() {
  return await rl.question(`Google Spreadsheet ID: `);
}

async function setCredentialsPath() {
  const credentialsPath = await rl.question(`Google credentials' directory path(default: home dir of os, file name: ${GOOGLE_CREDENTIALS_FILE_NAME}): `);
  if (!credentialsPath) {
    informSetDefaultPath();
    return homedir;
  }
  return credentialsPath;
}

async function setTokenPath() {
  const tokenPath = await rl.question(`Directory path to save google oauth2 token (default: home dir of os, file name: ${GOOGLE_OAUTH2_TOKEN_FILE_NAME}): `);
  if (!tokenPath) {
    informSetDefaultPath();
    return homedir;
  }
  return tokenPath;
}

async function setDestinationDir() {
  return await rl.question(`Destination directory path: `);
}

function informSetDefaultPath() {
  console.log(chalk(`set the default path: ${homedir}`))
}