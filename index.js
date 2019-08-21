#!/usr/bin/env node

const commander = require('commander');
const description = require('./lib/constants');
const { convert } = require('./lib/convert');
const { setup, CONFIG_FILE_NAME } = require('./lib/setup');
const { chalk } = require('./lib/common-utils');

const program = new commander.Command();

program
  .version('v0.0.1', '-v, --version')
  .action(() => {
    process.exit(0);
  });

program
  .command('convert <sheetName>').alias('cvt')
  .description(description.CONVERT)
  .option('--credentials <path>', description.CREDENTIALS)
  .option('--token <path>', description.TOKEN)
  .option('-s, --start <range>', description.RANGE_START)
  .option('-e, --end <range>', description.RANGE_END)
  .action((sheetName, options) => {
    convert(sheetName, program.config, options)
      .then(() => {
        console.log(chalk('All data translated'));
        process.exit(0);
      })
      .catch(error => console.error(error));
  });

program
  .command('setup')
  .description(description.SETUP)
  .action((options) => {
    setup()
      .then(() => console.log(chalk('Setup completed')))
      .catch(error => console.error(error))
  })

program.parse(process.argv);

if (program.args.length === 0) {
  process.exit(0);
}