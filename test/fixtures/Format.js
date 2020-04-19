const obj = { object: { test: 1 }, msg: 'the message' }

const err = new TypeError('error message')
err.stack = 'TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile' // shortened stack
err.status = 500

module.exports = [
  ['string'],
  ['1'],
  ['false'],
  ['{"object":{"test":1},"msg":"the message"}'],
  ['"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"'],
  ['string'],
  ['1'],
  ['false'],
  ['{"object":{"test":1},"msg":"the message"}'],
  ['{"object":{"test":1},"msg":"the message"}'],
  ['[1,2,3]'],
  ['"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"'],
  ['{"a":{"b":{"c":1},"e":"[Circular ~.a]"},"d":"[Circular ~]"}'],
  ['null'],
  ['undefined'],
  ['0'],
  ['NaN'],
  ['hello world'],
  ['digit 42.7'],
  ['integer 42'],
  ['float 42.666'],
  ['json {"object":{"test":1},"msg":"the message"}'],
  ['obj {"object":{"test":1},"msg":"the message"}'],
  ['obj [1,2,3]'],
  ['error "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"'],
  ['mixed %% string 1.1 2 3.33 {"object":{"test":1},"msg":"the message"} "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"'],
  ['"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"',
    '%s %% %d', 'string', 1.1],
  ['"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"',
    obj, '%s %% %d', 'string', 1.1],
  ['string %% 1.1', obj, err],
  ['{"7123000":7123000,"_abcdEF$01":"abcdef","0.1234":0.1234,"s p-a c e":"space","\\"\'``\\"":"\\"\'``\\"","\\"":"\\"","\'":"\'"}'],
  ['{"req":{"url":"/test","ip":"10.10.10.10"}}'],
  ['{"name":{"test":1},"msg":"with level","level":"NONESENSE"}']
]
