const wcwidth = require("wcwidth")

module.exports = function(input, breakAtLength) {

  let str = input.toString()
  const charArr = [...str]
  let index = 0
  let indexOfLastFitChar = 0
  let fittableLength = 0

  while(charArr.length > 0) {

    const char = charArr.shift()
    const currentLength = fittableLength + wcwidth(char)

    if(currentLength <= breakAtLength) {
      indexOfLastFitChar = index
      fittableLength = currentLength
      index++
    } else {
      break
    }

  }

  //break after this character
  return indexOfLastFitChar
}
