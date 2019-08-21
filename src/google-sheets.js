const { getOAuth2Client, getGoogleSheets, GoogleSheetsV4Scopes } = require(`./google-utils`);
const { prettifyDirectoryPath } = require('./common-utils')
const {
  GOOGLE_CREDENTIALS_FILE_NAME,
  GOOGLE_OAUTH2_TOKEN_FILE_NAME,
} = require('./setup');

let oAuth2Client;
let sheets;

class GoogleSheets {
  /**
   * @param {string} credentialsPath reference https
   * @param {string} tokenPath
   * @param {string} spreadsheetId https://docs.google.com/spreadsheets/d/[spreadsheet-id]/
   */
  constructor(credentialsPath, tokenPath, spreadsheetId) {
    if (!credentialsPath) {
      throw Error(`Error required credentials.json path, input: ${credentialsPath}`)
    }
    if (!tokenPath) {
      throw Error(`Error required credentials.json path, input: ${tokenPath}`)
    }
    if (!spreadsheetId) {
      throw Error(`Error required spreadsheet id, input: ${spreadsheetId}`)
    }
    this.credentialsPath = `${prettifyDirectoryPath(credentialsPath)}/${GOOGLE_CREDENTIALS_FILE_NAME}`;
    this.tokenPath = `${prettifyDirectoryPath(tokenPath)}/${GOOGLE_OAUTH2_TOKEN_FILE_NAME}`;
    this.spreadsheetId = spreadsheetId;
  }

  /**
   *
   * @param {string} sheetName
   * @param {string} rangeStart ex) A1, B, 1, ...
   * @param {string} rangeEnd ex) A1, B, 1, ...
   * @see https://developers.google.com/sheets/guides/concepts#a1
   *
   * @returns {Promise<Array<string>>}
   */
  async convert(sheetName, rangeStart, rangeEnd) {
    await checkConfig(this.credentialsPath, this.tokenPath);
    const range = convertToA1Notation(sheetName, rangeStart, rangeEnd);
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range,
    })
    return res.data.values
  }
}

async function checkConfig(credentialsPath, tokenPath) {
  if (!oAuth2Client) {
    oAuth2Client = await getOAuth2Client({ credentialsPath, tokenPath });
  }
  sheets = getGoogleSheets(oAuth2Client);
}

function convertToA1Notation(sheetName, rangeStart, rangeEnd) {
  if (!(rangeStart || rangeEnd)) {
    return sheetName;
  }
  return `'${sheetName}'!${rangeStart}:${rangeEnd}`;
}

module.exports = {
  GoogleSheets,
  GoogleSheetsV4Scopes,
}