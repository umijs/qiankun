'use strict';

let Tests = {};
const fs = require('fs'); 
//const glob = require('glob');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const smartwrap = require("../");
const data = require("./data")

let test = function(testResult,savedResult){
  it(`'${testResult}' should match '${savedResult}'`, () => {
    testResult.should.equal(savedResult);
  })
};

for(let i in data){  
  
  //generate new output 
  let options = {};
  [
    'width',
    'minWidth',
    'paddingLeft',
    'paddingRight',
    'trim',
    'breakword'
  ].forEach( element => {
    if (typeof data[i][element] !== 'undefined') {
     options[element] = data[i][element]; 
    }
  });

  let testResult = smartwrap(data[i].input,options);

  console.log("Test Properties:",data[i]);
  console.log("12345678901234567890");
  console.log("BEGIN---------------");
  console.log(testResult);
  console.log("END-----------------\n");

  switch(true){
    case(typeof global.save !== 'undefined' && global.save):
    //save tests
      data[i].output = testResult;
      break;
    case(typeof global.display !== 'undefined' && global.display):
    //show tests (do nothing)
      break;
    default:
    //run tests
      describe('Test '+i, () => {
        test(testResult, data[i].output);
      })
  }
}

if(typeof global.save !== 'undefined' && global.save){
  //write saved dataect to file
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  console.log("Tests saved to file.");
}

module.exports = Tests;
