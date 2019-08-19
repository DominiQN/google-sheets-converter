const program = require('commander');
const homedir = require('os').homedir();
// const fs = require('fs');
// const { GoogleSheets } = require(`./src/google-sheets-translator`);

program.version('0.0.1', '-v, --version');

program
  .command('translate [config-path]')
  .alias('t')
  .option('--credentials-path <path>', 'google-credentials.json path', `${homedir}/google-credentials.json`)
  .option('--token-path <path>', 'google-oauth2-token path', `${homedir}/google-auth-token.json`)
  .action(translate);

program.parse(process.argv);

function translate(configPath) {
  console.log(configPath)
}

// const parser = new GoogleSheetsTranslator(
//   program.credentialsPath,
//   program.tokenPath,
//   '1z6l_8AtyC7qPCeWfQJ4FHjeNp1p_1iPPhXt2WFkk50k'
// );
// parser.translate('Trinity', 'A2', 'E')
//   .then(data => console.log(data))
//   .catch(err => console.error(err));