const program = require('commander');

program.version('0.0.1');

program
  .option('-p, --path <path>', 'path')
  .parse(process.argv)

let path

if (program.path) {
  path = program.path
} else if (process.env.PROJECT_PATH) {
  path = process.env.PROJECT_PATH
} else {
  path = process.cwd()
}

console.log('path: ', path)