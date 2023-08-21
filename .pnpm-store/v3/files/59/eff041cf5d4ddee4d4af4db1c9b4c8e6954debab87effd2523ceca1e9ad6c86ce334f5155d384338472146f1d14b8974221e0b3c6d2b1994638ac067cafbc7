
/*
Stream Transform - sync module

Please look at the [project documentation](https://csv.js.org/transform/) for
additional information.
*/

const transform = require('.')
const {clone} = require('mixme')

module.exports = function(){
  // Import arguments normalization
  let handler, callback
  let options = {}
  for(i in arguments){
    const argument = arguments[i]
    let type = typeof argument
    if(argument === null){
      type = 'null'
    }else if(type === 'object' && Array.isArray(argument)){
      type = 'array'
    }
    if(type === 'array'){
      records = argument
    }else if(type === 'object'){
      options = clone(argument)
    }else if(type === 'function'){
      if(handler && i === arguments.length - 1){
        callback = argument
      }else{
        handler = argument
      }
    }else if(type !== 'null'){
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`)
    }
  }
  // Validate arguments
  let expected_handler_length = 1
  if(options.params){
    expected_handler_length++
  }
  if(handler.length > expected_handler_length){
    throw Error('Invalid Handler: only synchonous handlers are supported')
  }
  // Start transformation
  const chunks = []
  const transformer = new transform.Transformer(options, handler)
  transformer.push = function(chunk){
    chunks.push(chunk)
  }
  for(const record of records){
    transformer._transform(record, null, function(){})
  }
  return chunks  
}
