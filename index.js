const commander = require('commander');
const description = require('./src/constants');
const { convert } = require('./src/convert');
const { setup } = require('./src/setup');
const { chalk } = require('./src/common-utils');

const program = new commander.Command();

program
  .version('v0.0.1', '-v, --version')
  .option('-c, --config <path>', description.CONFIG, `${process.cwd()}/sheets-config.json`)
  .action(() => {
    console.log(chalk('current config path:', program.config));
  });

program
  .command('convert <sheetName>').alias('ct')
  .description(description.CONVERT)
  .option('--credentials <path>', description.CREDENTIALS)
  .option('--token <path>', description.TOKEN)
  .option('-s, --start <range>', description.RANGE_START)
  .option('-e, --end <range>', description.RANGE_END)
  .action((sheetName, options) => {
    convert(sheetName, program.config, options)
      .then(() => console.log(chalk('All data translated')))
      .catch(error => console.error(error));
  });

program
  .command('setup')
  .description(description.SETUP)
  .action((options) => {
    setup(options)
      .then(() => console.log(chalk('Setup completed')))
      .catch(error => console.error(error))
  })

program.parse(process.argv);