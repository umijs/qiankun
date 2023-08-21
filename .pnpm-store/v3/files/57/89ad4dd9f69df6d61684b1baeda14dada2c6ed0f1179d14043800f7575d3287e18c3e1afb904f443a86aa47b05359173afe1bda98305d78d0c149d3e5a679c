const defaults = require("./defaults.js")
const Render = require("./render.js")
const Style = require("./style.js")
let counter = 0

const Factory = function (paramsArr) {
  const _configKey = Symbol.config
  let header = []
  const body = []
  let footer = []
  let options = {}

  // handle different parameter scenarios
  switch (true) {
    // header, rows, footer, and options
    case (paramsArr.length === 4):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows (body)
      footer = paramsArr[2]
      options = paramsArr[3]
      break

    // header, rows, footer
    case (paramsArr.length === 3 && paramsArr[2] instanceof Array):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows
      footer = paramsArr[2]
      break

    // header, rows, options
    case (paramsArr.length === 3 && typeof paramsArr[2] === "object"):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows
      options = paramsArr[2]
      break

    // header, rows            (rows, footer is not an option)
    case (paramsArr.length === 2 && paramsArr[1] instanceof Array):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows
      break

    // rows, options
    case (paramsArr.length === 2 && typeof paramsArr[1] === "object"):
      body.push(...paramsArr[0]) // creates new array to store our rows
      options = paramsArr[1]
      break

    // rows
    case (paramsArr.length === 1 && paramsArr[0] instanceof Array):
      body.push(...paramsArr[0])
      break

    // adapter called: i.e. `require('tty-table')('automattic-cli')`
    case (paramsArr.length === 1 && typeof paramsArr[0] === "string"):
      return require(`../adapters/${paramsArr[0]}`)

    /* istanbul ignore next */
    default:
      console.log("Error: Bad params. \nSee docs at github.com/tecfu/tty-table")
      process.exit()
  }

  // for "deep" copy, use JSON.parse
  const cloneddefaults = JSON.parse(JSON.stringify(defaults))
  const config = Object.assign({}, cloneddefaults, options)

  // backfixes for shortened option names
  config.align = config.alignment || config.align
  config.headerAlign = config.headerAlignment || config.headerAlign

  // for truncate true is equivalent to empty string
  if (config.truncate === true) config.truncate = ""

  // if borderColor customized, color the border character set
  if (config.borderColor) {
    config.borderCharacters[config.borderStyle]
      = config.borderCharacters[config.borderStyle].map(function (obj) {
        Object.keys(obj).forEach(function (key) {
          obj[key] = Style.style(obj[key], config.borderColor)
        })
        return obj
      })
  }

  // save a copy for merging columnSettings into cell options
  config.columnSettings = header.slice(0)

  // header
  config.table.header = header

  // match header geometry with body array
  config.table.header = [config.table.header]

  // footer
  config.table.footer = footer

  // counting table enables fixed column widths for streams,
  // variable widths for multiple tables simulateously
  if (config.terminalAdapter !== true) {
    counter++ // fix columnwidths for streams
  }
  config.tableId = counter

  // create a new object with an Array prototype
  const tableObject = Object.create(body)

  // save configuration to new object
  tableObject[_configKey] = config

  /**
   * Add method to render table to a string
   * @returns {String}
   * @memberof Table
   * @example
   * ```js
   * let str = t1.render();
   * console.log(str); //outputs table
   * ```
  */
  tableObject.render = function () {
    const output = Render.stringifyData(this[_configKey], this.slice(0)) // get string output
    tableObject.height = this[_configKey].height
    return output
  }

  return tableObject
}

const Table = function () {
  return new Factory(arguments)
}

Table.resetStyle = Style.resetStyle
Table.style = Style.styleEachChar

module.exports = Table
