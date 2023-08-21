
/*
CSV Generate - sync module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/

const generate = require('.')

module.exports = function(options){
  if(typeof options === 'string' && /\d+/.test(options)){
    options = parseInt(options)
  }
  if(Number.isInteger(options)){
    options = {length: options}
  }else if(typeof options !== 'object' || options === null){
    throw Error('Invalid Argument: options must be an o object or a integer')
  }
  if(!Number.isInteger(options.length)){
    throw Error('Invalid Argument: length is not defined')
  }
  const chunks = []
  let work = true
  // See https://nodejs.org/api/stream.html#stream_new_stream_readable_options
  options.highWaterMark = options.objectMode ? 16 : 16384
  const generator = new generate.Generator(options)
  generator.push = function(chunk){
    if(chunk === null){
      return work = false 
    }
    if(options.objectMode){
      chunks.push(chunk)
    }else{
      chunks.push(chunk)  
    }
  }
  while(work){
    generator._read(options.highWaterMark)
  }
  if(!options.objectMode){
    return chunks.join('')
  }else{
    return chunks
  }
}
