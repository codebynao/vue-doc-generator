const fs = require('fs')

/**
 * Format config file properly
 * @param {Object} config
 * @returns {String} config file formatted
 */
const formatConfigFile = config => {
  let stringFile = 'module.exports = {\n'

  for (const [key, value] of Object.entries(config)) {
    stringFile += `  ${key}: '${value}'`

    const index = Object.keys(config).findIndex(el => el === key)

    if (index !== -1 && Object.keys(config).length > index + 1) {
      stringFile += ','
    }
    stringFile += '\n'
  }

  stringFile += '}'
  return stringFile
}

/**
 * Initialize config file in traget project
 * @param {Object} argv - arguments of config file
 */
const init = argv => {
  // Get template of the config file
  const configFile = require(`${__dirname}/template/config.js`)

  // Replace config object values if the user updated them in the command arguments
  for (const [key, value] of Object.entries(argv).slice(1)) {
    if (configFile[key]) {
      configFile[key] = value
    }
  }

  // Conver the config object into a formatted string
  const stringFile = formatConfigFile(configFile)

  // Create config file in target location
  fs.writeFileSync('./vuedoc.config.js', stringFile)
}

module.exports = { init }
