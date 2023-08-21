const Style = require("./style.js")
const Format = require("./format.js")

/**
 * Converts arrays of data into arrays of cell strings
 * @param {TtyTable.Config} config
 * @param {Array<Array<string>|object|TtyTable.Formatter>} inputData
 * @returns {Array<string>}
 */
module.exports.stringifyData = (config, inputData) => {
  const sections = {
    header: [],
    body: [],
    footer: []
  }
  const marginLeft = Array(config.marginLeft + 1).join(" ")
  const borderStyle = config.borderCharacters[config.borderStyle]
  const borders = []

  // support backwards compatibility cli-table's multiple constructor geometries
  // @TODO deprecate and support only a single format
  const constructorType = exports.getConstructorGeometry(inputData[0] || [], config)
  const rows = exports.coerceConstructorGeometry(config, inputData, constructorType)

  // when streaming values to tty-table, we don't want column widths to change
  // from one rows set to the next, so we save the first set of widths and reuse
  if (!global.columnWidths) {
    global.columnWidths = {}
  }

  if (global.columnWidths[config.tableId]) {
    config.table.columnWidths = global.columnWidths[config.tableId]
  } else {
    global.columnWidths[config.tableId] = config.table.columnWidths = Format.getColumnWidths(config, rows)
  }

  // stringify header cells
  // hide header if no column names or if specified in config
  switch (true) {
    case (config.showHeader !== null && !config.showHeader): // explicitly false, hide
      sections.header = []
      break

    case (config.showHeader === true): // explicitly true, show
    case (!!config.table.header[0].find(obj => obj.value || obj.alias)): //  atleast one named column, show header
      sections.header = config.table.header.map(row => {
        return exports.buildRow(config, row, "header", null, rows, inputData)
      })
      break

    default: // no named columns, hide
      sections.header = []
  }

  // stringify body cells
  sections.body = rows.map((row, rowIndex) => {
    return exports.buildRow(config, row, "body", rowIndex, rows, inputData)
  })

  // stringify footer cells
  sections.footer = (config.table.footer instanceof Array && config.table.footer.length > 0) ? [config.table.footer] : []

  sections.footer = sections.footer.map(row => {
    return exports.buildRow(config, row, "footer", null, rows, inputData)
  })

  // apply borders
  // 0=top, 1=middle, 2=bottom
  for (let a = 0; a < 3; a++) {
    // add left border
    borders[a] = borderStyle[a].l

    // add joined borders for each column
    config.table.columnWidths.forEach((columnWidth, index, arr) => {
      // Math.max because otherwise columns 1 wide wont have horizontal border
      borders[a] += Array(Math.max(columnWidth, 2)).join(borderStyle[a].h)
      borders[a] += ((index + 1 < arr.length) ? borderStyle[a].j : "")
    })

    // add right border
    borders[a] += borderStyle[a].r

    // no trailing space on footer
    borders[a] = (a < 2) ? `${marginLeft + borders[a]}\n` : marginLeft + borders[a]
  }

  // top horizontal border
  let output = borders[0]

  // for each section (header,body,footer)
  Object.keys(sections).forEach((p, i) => {
    // for each row in the section
    while (sections[p].length) {
      const row = sections[p].shift()

      // if(row.length === 0) {break}

      row.forEach(line => {
        // vertical row borders
        output = `${output
          + marginLeft
          // left vertical border
          + borderStyle[1].v
          // join cells on vertical border
          + line.join(borderStyle[1].v)
          // right vertical border
          + borderStyle[1].v
          // end of line
        }\n`
      })

      // bottom horizontal row border
      switch (true) {
      // skip if end of body and no footer
        case (sections[p].length === 0
             && i === 1
             && sections.footer.length === 0):
          break

        // skip if end of footer
        case (sections[p].length === 0
             && i === 2):
          break

        // skip if compact
        case (config.compact && p === "body" && !row.empty):
          break

        // skip if border style is "none"
        case (config.borderStyle === "none" && config.compact):
          break

        default:
          output += borders[1]
      }
    }
  })

  // bottom horizontal border
  output += borders[2]

  const finalOutput = Array(config.marginTop + 1).join("\n") + output

  // record the height of the output
  config.height = finalOutput.split(/\r\n|\r|\n/).length

  return finalOutput
}

module.exports.buildRow = (config, row, rowType, rowIndex, rowData, inputData) => {
  let minRowHeight = 0

  // tag row as empty if empty, used for `compact` option
  if (row.length === 0 && config.compact) {
    row.empty = true
    return row
  }

  // force row to have correct number of columns
  const lengthDifference = config.table.columnWidths.length - row.length
  if (lengthDifference > 0) {
    // array (row) lacks elements, add until equal
    row = row.concat(Array.apply(null, new Array(lengthDifference)).map(() => null))
  } else if (lengthDifference < 0) {
    // array (row) has too many elements, remove until equal
    row.length = config.table.columnWidths.length
  }

  // convert each element in row to cell format
  row = row.map((elem, elemIndex) => {
    const cell = exports.buildCell(config, elem, elemIndex, rowType, rowIndex, rowData, inputData)
    minRowHeight = (minRowHeight < cell.length) ? cell.length : minRowHeight
    return cell
  })

  // apply top and bottom padding to row
  minRowHeight = (rowType === "header") ? minRowHeight
    : minRowHeight + (config.paddingBottom + config.paddingTop)

  const linedRow = Array.apply(null, { length: minRowHeight })
    .map(Function.call, () => [])

  row.forEach(function (cell, a) {
    const whitespace = Array(config.table.columnWidths[a]).join(" ")

    if (rowType === "body") {
      // add whitespace for top padding
      for (let i = 0; i < config.paddingTop; i++) {
        cell.unshift(whitespace)
      }

      // add whitespace for bottom padding
      for (let i = 0; i < config.paddingBottom; i++) {
        cell.push(whitespace)
      }
    }

    // a `row` is divided by columns (horizontally)
    // a `linedRow` becomes the row divided instead into an array of vertical lines
    // each nested line divided by columns
    for (let i = 0; i < minRowHeight; i++) {
      linedRow[i].push((typeof cell[i] !== "undefined")
        ? cell[i] : whitespace)
    }
  })

  return linedRow
}

module.exports.buildCell = (config, elem, columnIndex, rowType, rowIndex, rowData, inputData) => {
  let cellValue = null

  const cellOptions = Object.assign(
    { reset: false },
    config,
    (rowType === "body") ? config.columnSettings[columnIndex] : {}, // ignore columnSettings for footer
    (typeof elem === "object") ? elem : {}
  )

  if (rowType === "header") {
    config.table.columns.push(cellOptions)
    cellValue = cellOptions.alias || cellOptions.value || ""
  } else {
    // set cellValue
    switch (true) {
      case (typeof elem === "undefined" || elem === null):
        // replace undefined/null elem values with placeholder
        cellValue = (config.errorOnNull) ? config.defaultErrorValue : config.defaultValue
        // @TODO add to elem defaults
        cellOptions.isNull = true
        break

      case (typeof elem === "object" && elem !== null && typeof elem.value !== "undefined"):
        cellValue = elem.value
        break

      case (typeof elem === "function"):
        cellValue = elem.bind({
          configure: function (object) {
            return Object.assign(cellOptions, object)
          },
          style: Style.style,
          resetStyle: Style.resetStyle
        })(
          (!cellOptions.isNull) ? cellValue : "",
          columnIndex,
          rowIndex,
          rowData,
          inputData
        )
        break

      default:
        // elem is assumed to be a scalar
        cellValue = elem
    }

    // run formatter
    if (typeof cellOptions.formatter === "function") {
      cellValue = cellOptions.formatter
        .bind({
          configure: function (object) {
            return Object.assign(cellOptions, object)
          },
          style: Style.style,
          resetStyle: Style.resetStyle
        })(
          (!cellOptions.isNull) ? cellValue : "",
          columnIndex,
          rowIndex,
          rowData,
          inputData
        )
    }
  }

  // colorize cellValue
  // we don't want the formatter to pass a styled cell value with ANSI codes
  // (in case user wants to do math or string operations to cell value), so
  // we apply default styles to the cell after it runs through the formatter
  // and omit those default styles if the user applied `this.resetStyle`
  if (!cellOptions.reset) {
    cellValue = Style.colorizeCell(cellValue, cellOptions, rowType)
  }

  // textwrap cellValue
  const { cell, innerWidth } = Format.wrapCellText(cellOptions, cellValue, columnIndex, cellOptions, rowType)

  if (rowType === "header") {
    config.table.columnInnerWidths.push(innerWidth)
  }

  return cell
}

/**
 * Check for a backwards compatible (cli-table) constructor
 */
module.exports.getConstructorGeometry = (row, config) => {
  let type

  // rows passed as an object
  if (typeof row === "object" && !(row instanceof Array)) {
    const keys = Object.keys(row)

    if (config.adapter === "automattic") {
      // detected cross table
      const key = keys[0]

      if (row[key] instanceof Array) {
        type = "automattic-cross"
      } else {
        // detected vertical table
        type = "automattic-vertical"
      }
    } else {
      // detected horizontal table
      type = "o-horizontal"
    }
  } else {
    // rows passed as an array
    type = "a-horizontal"
  }

  return type
}

/**
 * Coerce backwards compatible constructor styles
 */
module.exports.coerceConstructorGeometry = (config, rows, constructorType) => {
  let output = []
  switch (constructorType) {
    case ("automattic-cross"):
      // assign header styles to first column
      config.columnSettings[0] = config.columnSettings[0] || {}
      config.columnSettings[0].color = config.headerColor

      output = rows.map(obj => {
        const arr = []
        const key = Object.keys(obj)[0]
        arr.push(key)
        return arr.concat(obj[key])
      })
      break

    case ("automattic-vertical"):
      // assign header styles to first column
      config.columnSettings[0] = config.columnSettings[0] || {}
      config.columnSettings[0].color = config.headerColor

      output = rows.map(function (value) {
        const key = Object.keys(value)[0]
        return [key, value[key]]
      })
      break

    case ("o-horizontal"):
      // cell property names are specified in header columns
      if (config.table.header[0].length
        && config.table.header[0].every(obj => obj.value)) {
        output = rows.map(row => config.table.header[0]
          .map(obj => row[obj.value]))
      } // eslint-disable-line brace-style
      // no property names given, default to object property order
      else {
        output = rows.map(obj => Object.values(obj))
      }
      break

    case ("a-horizontal"):
      output = rows
      break

    default:
  }

  return output
}

// @TODO For rotating horizontal data into a vertical table
// assumes all rows are same length
// module.exports.verticalizeMatrix = (config, inputArray) => {
//
//   // grow to # arrays equal to number of columns in input array
//   let outputArray = []
//   let headers = config.table.columns
//
//   // create a row for each heading, and prepend the row
//   // with the heading name
//   headers.forEach(name => outputArray.push([name]))
//
//   inputArray.forEach(row => {
//     row.forEach((element, index) => outputArray[index].push(element))
//   })
//
//   return outputArray
// }
