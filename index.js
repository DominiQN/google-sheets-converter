const commander = require('commander');
const description = require('./src/constants');
const { convert } = require('./src/convert');
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
  .command('convert <sheetName>').alias('ct')
  .description(description.CONVERT)
  .option('--credentials <path>', description.CREDENTIALS)
  .option('--token <path>', description.TOKEN)
  .option('-s, --start <range>', description.RANGE_START)
  .option('-e, --end <range>', description.RANGE_END)
  .action((sheetName, options) => {
    convert(sheetName, program.config, options)
      .then(() => console.log(chalk.blueBright('All data translated')))
      .catch(error => console.error(error));
  });

program.parse(process.argv);