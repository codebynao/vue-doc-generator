#! /usr/bin/env node

const chalk = require('chalk')

const getVersion = () => {
  const packagejson = require('./package.json')
  console.info(packagejson.version)
}

const showHelp = argv => {
  const menus = {
    main: `
  ${chalk.magentaBright('vdoc [command] <options>')}
  ${chalk.blueBright(
    'help'
  )} ............... show help menu for a command
  ${chalk.blueBright('version')} ............ show package version
  ${chalk.blueBright(
    'init'
  )} ................ initialize vdoc config file
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
