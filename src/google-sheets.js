const { google } = require('googleapis');
const { getOAuth2Client, GoogleSheetsV4Scopes } = require(`./google-utils`)

module.exports = {
  GoogleSheets,
  GoogleSheetsV4Scopes,
}

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
    this.credentialsPath = credentialsPath;
    this.tokenPath = tokenPath;
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
  async translate (sheetName, rangeStart, rangeEnd) {
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
  sheets = getSheets(oAuth2Client);
}

function getSheets(auth) {
  return google.sheets({ version: 'v4', auth });
}

function convertToA1Notation(sheetName, rangeStart, rangeEnd) {
  return `'${sheetName}'!${rangeStart}:${rangeEnd}`;
}