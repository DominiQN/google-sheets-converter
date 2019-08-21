const fs = require('fs-extra');
const { chalk, prettifyDirectoryPath } = require('./common-utils');
const {
  DEFAULT_CREDENTIALS_PATH,
  DEFAULT_TOKEN_PATH,
  CONFIG_FILE_NAME,
} = require('./setup');
const { GoogleSheets } = require(`./google-sheets`);

let _config;

exports.convert = async function convert(sheetName, options) {
  const sheets = await getGoogleSheets(options);
  const rows = await sheets.convert(sheetName, options.start, options.end);
  const fileStringList = await convertSheetsDataToFileString(rows);
  await writeFile(fileStringList);
}

async function getGoogleSheets(options) {
  const config = await getConfig(options.config);
  const credentialsPath = options.credentials || config.credentialsPath || DEFAULT_CREDENTIALS_PATH;
  const tokenPath = options.token || config.tokenPath || DEFAULT_TOKEN_PATH;

  console.log(chalk(`credentials path: '${credentialsPath}'`));
  console.log(chalk(`token path: '${tokenPath}'`));

  const sheets = new GoogleSheets(credentialsPath, tokenPath, config.spreadsheetId);
  return sheets;
}

async function getConfig(configPath) {
  if (_config) {
    return _config;
  }
  const configStr = await fs.readFile(`${configPath}/${CONFIG_FILE_NAME}`)
    .catch(() => {
      console.warn(chalk(`Config file not exists. path: '${configPath}'`), );
      process.exit(1);
    });

  if (configStr) {
    _config = JSON.parse(configStr);
  }
  return _config;
}

/**
 * @returns {Object} make sure that keys are file name.
 */
async function convertSheetsDataToFileString(rows) {
  const KEY = 1;
  const LANGUAGE_START_COL = 3;
  const colNames = rows[0]
  console.log(chalk('columns'), colNames);

  const languages = colNames.slice(LANGUAGE_START_COL);
  console.log(chalk('languages'), languages);

  const sortedRows = rows.slice(1).sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });

  const config = await getConfig();
  const destDir = prettifyDirectoryPath(config.destinationDir);

  let currentCategory;

  const localeLangHeader = `export default {\n`;
  const localeLangTrailer = '}';

  const fileStringList = languages.map((language, index) => {
    const body = sortedRows.reduce((acc, row) => {
      let line = `  ${row[KEY]}: '${row[LANGUAGE_START_COL + parseInt(index)]}',\n`
      if (row[0] != currentCategory) {
        currentCategory = row[0];
        return acc + `  /*\n   * ${currentCategory}\n   */\n` + line;
      }
      return acc + line;
    }, localeLangHeader);

    return new FileString(
      `${destDir}/lib/util/lang/locales`,
      `${language}.js`,
      body + localeLangTrailer
    );
  });

  // lib
  const stringsImport = `import I18n from 'lib/util/lang/I18n'\n\n`;
  const stringsDeclarationHeader = `const Strings = {\n`;
  const stringsTrailer = `}\n\nexport default Strings`;
  const stringsFileString = sortedRows.reduce((acc, row) =>
    acc + `  ${row[KEY]}: I18n.t('${row[KEY]}'),\n`,
    stringsImport + stringsDeclarationHeader
  );

  fileStringList.push(new FileString(
    `${destDir}/res`,
    'Strings.js',
    stringsFileString + stringsTrailer
  ));

  return fileStringList;
}

async function writeFile(fileStringList) {
  //TODO: progress
  for (let f of fileStringList) {
    console.log(chalk(await f.write()));
  }
}

class FileString {
  constructor(fileDirectory, fileName, fileString) {
    this.filePath = prettifyDirectoryPath(fileDirectory);
    this.fileName = fileName;
    this.fileString = fileString;
    this.write = this.write.bind(this);
  }

  async write() {
    const filePath = `${this.filePath}/${this.fileName}`;
    await fs.mkdir(this.filePath, { recursive: true });
    await fs.writeFile(`${this.filePath}/${this.fileName}`, this.fileString);
    return filePath;
  }
}