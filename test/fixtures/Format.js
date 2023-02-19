const err = new TypeError('error message')
err.stack = 'TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile' // shortened stack
err.status = 500

export default {
  format: [
    'string',
    '1',
    'false',
    'the message',
    'error message',
    'string',
    '1',
    'false',
    'the message',
    'the message',
    '',
    'error message',
    '',
    'null',
    'undefined',
    '%d',
    '%d',
    'hello world',
    'digit 42.7',
    'json {"object":{"test":1},"msg":"the message"}',
    'obj {"object":{"test":1},"msg":"the message"}',
    'obj [1,2,3]',
    'error {"status":500}',
    'mixed % string 1.1 2.2 3.33 {"object":{"test":1},"msg":"the message"} {"status":500}',
    'error message %s %% %d string 1.1',
    'error message %s %% %d string 1.1',
    'string % 1.1',
    '',
    '',
    'with level'
  ]
}
