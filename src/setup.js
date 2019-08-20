const homedir = require('os').homedir();

exports.DEFAULT_CREDENTIALS_PATH = `${homedir}/google-credentials.json`
exports.DEFAULT_TOKEN_PATH = `${homedir}/google-oauth2-token.json`