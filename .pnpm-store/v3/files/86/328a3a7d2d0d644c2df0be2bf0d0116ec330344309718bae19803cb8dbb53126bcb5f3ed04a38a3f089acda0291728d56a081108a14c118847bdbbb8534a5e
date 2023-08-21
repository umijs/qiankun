const stripAnsi = require("strip-ansi")
const smartwrap = require("smartwrap")
const wcwidth = require("wcwidth")

const addPadding = (config, width) => {
  return width + config.paddingLeft + config.paddingRight
}

/**
 * Returns the widest cell give a collection of rows
 *
 * @param object columnOptions
 * @param array rows
 * @param integer columnIndex
 * @returns string
 */
const getMaxLength = (columnOptions, rows, columnIndex) => {
  let iterable

  // add header value, alias to calculate width when applicable
  if (columnOptions && (columnOptions.value || columnOptions.alias)) {
    // string we use from header
    let val = columnOptions.alias || columnOptions.value
    val = val.toString()
    // create a row with value in the current columnIndex
    const headerRow = Array(rows[0].length)
    headerRow[columnIndex] = val
    // add header row to new array we will check for max value width
    iterable = rows.slice()
    iterable.push(headerRow)
  } else {
    // no header value, just use rows to derive max width
    iterable = rows
  }

  const widest = iterable.reduce((prev, row) => {
    if (row[columnIndex]) {
      // check cell value is object or scalar
      const value = (row[columnIndex].value) ? row[columnIndex].value : row[columnIndex]
      const width = Math.max(
        ...stripAnsi(value.toString()).split(/[\n\r]/).map((s) => wcwidth(s))
      )
      return (width > prev) ? width : prev
    }
    return prev
  }, 0)

  return widest
}

/**
 * Get total width available to this table instance
 *
 *
 */
const getAvailableWidth = config => {
  if (process && ((process.stdout && process.stdout.columns) || (process.env && process.env.COLUMNS))) {
    // forked calls that do not inherit process.stdout must use process.env
    let viewport = (process.stdout && process.stdout.columns) ? process.stdout.columns : process.env.COLUMNS
    viewport = viewport - config.marginLeft

    // table width percentage of (viewport less margin)
    if (config.width !== "auto" && /^\d+%$/.test(config.width)) {
      return Math.min(1, (config.width.slice(0, -1) * 0.01)) * viewport
    }

    // table width fixed
    if (config.width !== "auto" && /^\d+$/.test(config.width)) {
      config.FIXED_WIDTH = true
      return config.width
    }

    // table width equals viewport less margin
    // @TODO deprecate and remove "auto", which was never documented so should not be
    // an issue
    return viewport
  }

  // browser
  /* istanbul ignore next */
  if (typeof window !== "undefined") return window.innerWidth // eslint-disable-line

  // process.stdout.columns does not exist. assume redirecting to write stream
  // use 80 columns, which is VT200 standard
  return config.COLUMNS - config.marginLeft
}

module.exports.getStringLength = string => {
  // stripAnsi(string.replace(/[^\x00-\xff]/g,'XX')).length
  return wcwidth(stripAnsi(string))
}

module.exports.wrapCellText = (
  config,
  cellValue,
  columnIndex,
  cellOptions,
  rowType
) => {
  // ANSI chararacters that demarcate the start/end of a line
  const startAnsiRegexp = /^(\033\[[0-9;]*m)+/
  const endAnsiRegexp = /(\033\[[0-9;]*m)+$/

  // coerce cell value to string
  let string = cellValue.toString()

  // store matching ANSI characters
  const startMatches = string.match(startAnsiRegexp) || [""]

  // remove ANSI start-of-line chars
  string = string.replace(startAnsiRegexp, "")

  // store matching ANSI characters so can be later re-attached
  const endMatches = string.match(endAnsiRegexp) || [""]

  // remove ANSI end-of-line chars
  string = string.replace(endAnsiRegexp, "")

  let alignTgt

  switch (rowType) {
    case ("header"):
      alignTgt = "headerAlign"
      break
    case ("body"):
      alignTgt = "align"
      break
    default:
      alignTgt = "footerAlign"
  }

  // equalize padding for centered lines
  if (cellOptions[alignTgt] === "center") {
    cellOptions.paddingLeft = cellOptions.paddingRight = Math.max(
      cellOptions.paddingRight,
      cellOptions.paddingLeft,
      0
    )
  }

  const columnWidth = config.table.columnWidths[columnIndex]

  // innerWidth is the width available for text within the cell
  const innerWidth = columnWidth
    - cellOptions.paddingLeft
    - cellOptions.paddingRight
    - config.GUTTER

  if (typeof config.truncate === "string") {
    string = exports.truncate(string, cellOptions, innerWidth)
  } else {
    string = exports.wrap(string, cellOptions, innerWidth)
  }

  // format each line
  const cell = string.split("\n").map(line => {
    line = line.trim()

    const lineLength = exports.getStringLength(line)

    // alignment
    if (lineLength < columnWidth) {
      let emptySpace = columnWidth - lineLength

      switch (true) {
        case (cellOptions[alignTgt] === "center"):
          emptySpace--
          const padBoth = Math.floor(emptySpace / 2)
          const padRemainder = emptySpace % 2
          line = Array(padBoth + 1).join(" ")
            + line
            + Array(padBoth + 1 + padRemainder).join(" ")
          break

        case (cellOptions[alignTgt] === "right"):
          line = Array(emptySpace - cellOptions.paddingRight).join(" ")
            + line
            + Array(cellOptions.paddingRight + 1).join(" ")
          break

        default:
          line = Array(cellOptions.paddingLeft + 1).join(" ")
            + line
            + Array(emptySpace - cellOptions.paddingLeft).join(" ")
      }
    }

    // put ANSI color codes BACK on the beginning and end of string
    return startMatches[0] + line + endMatches[0]
  })

  return { cell, innerWidth }
}

module.exports.truncate = (string, cellOptions, maxWidth) => {
  const stringWidth = wcwidth(string)

  if (maxWidth < stringWidth) {
    // @TODO give user option to decide if they want to break words on wrapping
    string = smartwrap(string, {
      width: maxWidth - cellOptions.truncate.length,
      breakword: true
    }).split("\n")[0]
    string = string + cellOptions.truncate
  }

  return string
}

module.exports.wrap = (string, cellOptions, innerWidth) => {
  const outstring = smartwrap(string, {
    errorChar: cellOptions.defaultErrorValue,
    minWidth: 1,
    trim: true,
    width: innerWidth
  })

  return outstring
}

module.exports.getColumnWidths = (config, rows) => {
  const availableWidth = getAvailableWidth(config)

  // iterate over the header if we have it, iterate over the first row
  // if we do not (to step through the correct number of columns)
  const iterable = (config.table.header[0] && config.table.header[0].length > 0)
    ? config.table.header[0] : rows[0]

  let widths = iterable.map((column, columnIndex) => {
    let result

    switch (true) {
      // column width is a percentage of table width specified in column header
      case (typeof column === "object" && (/^\d+%$/.test(column.width))):
        result = (column.width.slice(0, -1) * 0.01) * availableWidth
        result = addPadding(config, result)
        break

      // column width is specified in column header
      case (typeof column === "object" && (/^\d+$/.test(column.width))):
        result = column.width
        break

      // 'auto' sets column width to its longest value in the initial data set
      default:
        const columnOptions = (config.table.header[0][columnIndex])
          ? config.table.header[0][columnIndex] : {}
        const measurableRows = (rows.length) ? rows : config.table.header[0]

        result = getMaxLength(columnOptions, measurableRows, columnIndex)

        // add spaces for padding if not centered
        // @TODO test with if not centered conditional
        result = addPadding(config, result)
    }

    // add space for gutter
    result = result + config.GUTTER
    return result
  })

  // calculate sum of all column widths (including marginLeft)
  const totalWidth = widths.reduce((prev, current) => prev + current)

  // proportionately resize columns when necessary
  if (totalWidth > availableWidth || config.FIXED_WIDTH) {
    // proportion wont be exact fit, but this method keeps us safe
    const proportion = (availableWidth / totalWidth).toFixed(2) - 0.01
    const relativeWidths = widths.map(value => Math.max(2, Math.floor(proportion * value)))
    if (config.FIXED_WIDTH) return relativeWidths

    // when proportion < 0 column cant be resized and totalWidth must overflow viewport
    if (proportion > 0) {
      const totalRelativeWidths = relativeWidths.reduce((prev, current) => prev + current)
      widths = (totalRelativeWidths < totalWidth) ? relativeWidths : widths
    }
  } else {
    widths = widths.map(Math.floor)
  }

  return widths
}
