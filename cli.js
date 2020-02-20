#! /usr/bin/env node

const chalk = require('chalk')

const getVersion = () => {
  const packagejson = require('./package.json')
  console.info(packagejson.version)
}

const showHelp = argv => {
  const menus = {
    main: `
  Usage:

  ${chalk.blueBright('vdoc [command] <options>')}

  Options:

  -v --version              output the version number
  -h --help                 output usage information

  Commands:

  ${chalk.green(
    'help'
  )}                      Show help menu for a command
  ${chalk.green('version')}                   Show package version
  ${chalk.green(
    'init'
  )}                      Initialize vdoc config file
  ${chalk.green(
    'run'
  )}                       Generate vue documentation
`,
    init: `TODO`
  }

  const subCmd = argv._[0] === 'help' ? argv._[1] : argv._[0]
  console.log(menus[subCmd] || menus.main)
}

module.exports = {
  getVersion,
  showHelp
}
