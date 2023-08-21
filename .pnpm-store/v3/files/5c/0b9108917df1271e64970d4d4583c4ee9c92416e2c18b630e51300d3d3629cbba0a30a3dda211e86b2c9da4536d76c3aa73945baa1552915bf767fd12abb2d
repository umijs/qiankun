
const stringify = require('.')
const {StringDecoder} = require('string_decoder')

module.exports = function(records, options={}){
  const data = []
  if(Buffer.isBuffer(records)){
    const decoder = new StringDecoder()
    records = decoder.write(records)
  }
  function onData(record){
    if(record){
      data.push(record.toString())
    }
  }
  let stringifier = new stringify.Stringifier(options)
  stringifier.on('data', onData);
  for(let record of records){
    stringifier.write(record) 
  }
  stringifier.end()
  stringifier.off('data', onData);
  return data.join('')
}
