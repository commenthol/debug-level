const {
  circular,
  quotes,
  custom
} = require('./testcases')
const ua = require('../helpers/ua.js')

const err = {
  err: {
    name: 'TypeError',
    stack: 'TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile',
    status: 500
  }
}
const obj = {
  object: {
    test: 1
  }
}

module.exports = {
  browser: [
    ['ERROR test string +0ms'],
    ['ERROR test 1 +0ms'],
    ['ERROR test false +0ms'],
    ['ERROR test the message %O +0ms', obj],
    ['ERROR test error message %O +0ms', err],
    ['ERROR test string +0ms'],
    ['ERROR test 1 +0ms'],
    ['ERROR test false +0ms'],
    ['ERROR test the message %O +0ms', obj],
    ['ERROR test the message %O +0ms', obj],
    ['ERROR test  %O +0ms', { arr: [1, 2, 3] }],
    ['ERROR test error message %O +0ms', err],
    ['ERROR test  %O +0ms', circular],
    ['ERROR test null +0ms'],
    ['ERROR test undefined +0ms'],
    ['ERROR test %d +0ms'],
    ['ERROR test %d +0ms'],
    ['ERROR test hello world +0ms'],
    ['ERROR test digit 42.7 +0ms'],
    ['ERROR test json {"object":{"test":1},"msg":"the message"} +0ms'],
    ['ERROR test obj {"object":{"test":1},"msg":"the message"} +0ms'],
    ['ERROR test obj [1,2,3] +0ms'],
    ua === 'firefox'
      ? ['ERROR test error {"stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500} +0ms']
      : ['ERROR test error {"status":500} +0ms'],
    ua === 'firefox'
      ? ['ERROR test mixed % string 1.1 2.2 3.33 {"object":{"test":1},"msg":"the message"} {"stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500} +0ms']
      : ['ERROR test mixed % string 1.1 2.2 3.33 {"object":{"test":1},"msg":"the message"} {"status":500} +0ms'],
    ['ERROR test %s %% %d %O +0ms', err],
    ['ERROR test %s %% %d %O +0ms', { ...err, ...obj }],
    ['ERROR test string % 1.1 +0ms'],
    ['ERROR test  %O +0ms', quotes],
    ['ERROR test  %O +0ms', { req: custom }],
    ['ERROR test with level +0ms']
  ],
  colors: [
    ['%cERROR%c %ctest%c string %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c 1 %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c false %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c the message %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', obj, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c error message %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', err, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c string %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c 1 %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c false %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c the message %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', obj, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c the message %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', obj, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c  %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', { arr: [1, 2, 3] }, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c error message %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', err, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c  %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', circular, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c null %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c undefined %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c %d %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c %d %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c hello world %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c digit 42.7 %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c json {"object":{"test":1},"msg":"the message"} %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c obj {"object":{"test":1},"msg":"the message"} %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c obj [1,2,3] %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ua === 'firefox'
      ? ['%cERROR%c %ctest%c error {"stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500} %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit']
      : ['%cERROR%c %ctest%c error {"status":500} %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ua === 'firefox'
      ? ['%cERROR%c %ctest%c mixed % string 1.1 2.2 3.33 {"object":{"test":1},"msg":"the message"} {"stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500} %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit']
      : ['%cERROR%c %ctest%c mixed % string 1.1 2.2 3.33 {"object":{"test":1},"msg":"the message"} {"status":500} %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c %s %% %d %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', err, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c %s %% %d %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', { ...err, ...obj }, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c string % 1.1 %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c  %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', quotes, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c  %O %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', { req: custom }, 'color:#FF6600', 'color:inherit'],
    ['%cERROR%c %ctest%c with level %c+0ms%c', 'color:#CC0000', 'color:inherit', 'color:#FF6600;font-weight:bold', 'color:inherit', 'color:#FF6600', 'color:inherit']
  ]
}
