const commander = require('commander');
const description = require('./src/constants');
const { translate } = require('./src/translate');
const chalk = require('chalk');

const program = new commander.Command();

program
  .version('0.0.1', '-v, --version')
  .option('-c, --config <path>', description.CONFIG, `${process.cwd()}/sheets-config.json`);

// program
//   .command('setup', SETUP_DESCRIPTION).alias('c')
//   .option('-i, --interactive')

console.log(chalk.blueBright('current config path:', program.config));

program
  .command('translate <sheetName>').alias('t')
  .description(description.TRANSLATE)
  .option('--credentials <path>', description.CREDENTIALS)
  .option('--token <path>', description.TOKEN)
  .option('-s, --start <range>', description.RANGE_START)
  .option('-e, --end <range>', description.RANGE_END)
  .action((sheetName, options) => {
    translate(sheetName, program.config, options)
      .then(() => console.log(chalk.blueBright('All data translated')))
      .catch(error => console.error(error));
  });

program.parse(process.argv);