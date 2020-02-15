const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const vuedoc = require('@vuedoc/parser')

/**
 * Find all Vue files in a directory and sub directories
 * @param {String} dirPath
 * @param {Array} filesList
 * @returns {Array} list of found files
 */
function findVueFiles(dirPath, filesList = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const fileStat = fs.lstatSync(filePath)

    if (fileStat.isDirectory()) {
      findVueFiles(filePath, filesList)
    } else if (/.vue$/.test(filePath)) {
      filesList.push(filePath)
    }
  })

  return filesList
}

/**
 * Get the list of vue files
 */
const getVueFiles = () => {
  const config = require(`${process.cwd()}/vuedoc.config.js`)
  let path = config.rootDirectory
  if (!path) {
    return console.error(
      chalk.red('Error: missing rootDirectory in config file.')
    )
  }

  if (!fs.existsSync(path)) {
    return console.error(
      chalk.red('Error: rootDirectory value is not a valid path.')
    )
  }
  if (!fs.lstatSync(path).isDirectory()) {
    return console.error(
      chalk.red('Error: rootDirectory value is not a directory.')
    )
  }

  // Removing traling / or \ at the end of path
  if (
    path.charAt(path.length - 1) === '/' ||
    path.charAt(path.length - 1) === '\\'
  ) {
    path = path.slice(0, -1)
  }

  // Get all Vue files
  return findVueFiles(path)
}

/**
 * Read files to extract properties
 * @param {Array} files
 */
const parseVueFiles = async files => {
  const parsed = []
  for (const file of files) {
    console.info('file =========>', file)
    const componentData = {}
    const fileContent = fs.readFileSync(file, 'utf-8')

    parsed.push(
      await vuedoc.parse({
        filecontent: fileContent
      })
    )
  }
  return parsed
}

const generateDoc = async () => {
  const files = getVueFiles()
  const parsedFiles = await parseVueFiles(files)
  console.log(parsedFiles)
}

module.exports = { generateDoc }
