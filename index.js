#! /usr/bin/env node

const cli = require('./cli')
const init = require('./init')

const argv = require('minimist')(process.argv.slice(2))

let cmd = argv._[0] || 'help'
if (argv.version || argv.v) {
  cmd = 'version'
}

if (argv.help || argv.h) {
  cmd = 'help'
}

switch (cmd) {
  case 'help':
    cli.showHelp(argv)
    break
  case 'init':
    init.init(argv)
    break
  case 'version':
    cli.getVersion()
    break
  default:
    console.error(`"${cmd}" is not a valid command!`)
    break
}
