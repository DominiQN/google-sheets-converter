const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const open = require('open');
const { chalk } = require('./common-utils');

const GoogleSheetsV4Scopes = {
  SPREADSHEETS_READ_ONLY: 'https://www.googleapis.com/auth/spreadsheets.readonly',
  SPREADSHEETS_ALL: 'https://www.googleapis.com/auth/spreadsheets',
}

const SCOPES = [GoogleSheetsV4Scopes.SPREADSHEETS_READ_ONLY];

async function getOAuth2Client(options = {}) {
  const {
    // If modifying these scopes, delete token.json.
    scopes = SCOPES,
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    tokenPath,
    credentialsPath,
  } = options;

  if (!tokenPath) {
    throw Error(`Error required token' path`);
  }

  if (!credentialsPath) {
    throw Error(`Error required credentials' path`);
  }

  try {
    const credentials = await getCredentials(credentialsPath);
    return await authorize(credentials, tokenPath, scopes);
  } catch (error) {
    console.error(error);
  }
}

// Load client secrets from a local file.
function getCredentials(credentialsPath) {
  console.log(chalk(`read credentials from ${credentialsPath}`))
  return new Promise((resolve, reject) => {
    fs.readFile(credentialsPath, (error, content) => {
      if (error) {
        reject(`Error loading credentials: ${error}`);
      }
      // Authorize a client with credentials, then call the Google Sheets API.
      resolve(JSON.parse(content))
    });
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, tokenPath, scopes) {
  return new Promise((resolve, reject) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(tokenPath, (err, token) => {
      if (err) {
        return getNewToken(oAuth2Client, tokenPath, scopes, resolve, reject);
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, tokenPath, scopes, resolve, reject) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  open(authUrl);
  console.log(chalk('\nAuthorize this app by visiting this url:', authUrl));
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(chalk('Enter the code from that page here: '), (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        reject('while trying to retrieve access token' + err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
        if (err) {
          return reject(err);
        }
        console.log(chalk(`Token stored to ${tokenPath}`));
      });
      resolve(oAuth2Client);
    });
  });
}

function getGoogleSheets(auth) {
  return google.sheets({ version: 'v4', auth });
}

module.exports = {
  getOAuth2Client,
  getGoogleSheets,
  GoogleSheetsV4Scopes,
}