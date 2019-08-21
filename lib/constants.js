module.exports = {
  CONVERT: `Configuration path for google sheets. The name must be 'sheets-config.json'. Option priority: flags > config file > default`,
  CREDENTIALS: 'google-credentials.json path. default path is home directory of the current user',
  TOKEN: 'google-oauth2-token path. If not exists, a new token from google oauth will be saved this path. default path is home directory of the current user',
  CONFIG: 'set config path. defaults to ./sheets-config.json',
  RANGE_START: `set starting range like 'A1', or 'F'. If using ranges, it must be used with the '-e(--end)' option. see https://developers.google.com/sheets/guides/concepts#a1`,
  RANGE_END: `set ending range like 'F1', or 'G'. If using ranges, it must be used with the '-s(--start)' option. see https://developers.google.com/sheets/guides/concepts#a1`,
  SETUP: `make configuration file. default name is 'sheets-config.json'`,
}