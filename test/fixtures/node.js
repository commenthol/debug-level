module.exports = {
  debug: [
    '  ERROR test 1970-01-01T00:00:00.000Z string +0ms',
    '  ERROR test 1970-01-01T00:00:00.001Z 1 +0ms',
    '  ERROR test 1970-01-01T00:00:00.002Z false +1ms',
    '  ERROR test 1970-01-01T00:00:00.003Z the message {\n' +
    '  ERROR test   "object": {\n' +
    '  ERROR test     "test": 1\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.004Z error message {\n' +
    '  ERROR test   "err": {\n' +
    '  ERROR test     "msg": "error message",\n' +
    '  ERROR test     "name": "TypeError",\n' +
    '  ERROR test     "stack": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile",\n' +
    '  ERROR test     "status": 500\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.005Z string +1ms',
    '  ERROR test 1970-01-01T00:00:00.006Z 1 +1ms',
    '  ERROR test 1970-01-01T00:00:00.007Z false +1ms',
    '  ERROR test 1970-01-01T00:00:00.008Z the message {\n' +
    '  ERROR test   "object": {\n' +
    '  ERROR test     "test": 1\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.009Z the message {\n' +
    '  ERROR test   "object": {\n' +
    '  ERROR test     "test": 1\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.010Z {\n' +
    '  ERROR test   "arr": [\n' +
    '  ERROR test     1,\n' +
    '  ERROR test     2,\n' +
    '  ERROR test     3\n' +
    '  ERROR test   ]\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.011Z error message {\n' +
    '  ERROR test   "err": {\n' +
    '  ERROR test     "msg": "error message",\n' +
    '  ERROR test     "name": "TypeError",\n' +
    '  ERROR test     "stack": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile",\n' +
    '  ERROR test     "status": 500\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.012Z {\n' +
    '  ERROR test   "a": {\n' +
    '  ERROR test     "b": {\n' +
    '  ERROR test       "c": 1\n' +
    '  ERROR test     },\n' +
    '  ERROR test     "e": "[Circular]"\n' +
    '  ERROR test   },\n' +
    '  ERROR test   "d": {\n' +
    '  ERROR test     "a": {\n' +
    '  ERROR test       "b": {\n' +
    '  ERROR test         "c": 1\n' +
    '  ERROR test       },\n' +
    '  ERROR test       "e": "[Circular]"\n' +
    '  ERROR test     },\n' +
    '  ERROR test     "d": "[Circular]"\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.013Z null +1ms',
    '  ERROR test 1970-01-01T00:00:00.014Z undefined +1ms',
    '  ERROR test 1970-01-01T00:00:00.015Z %d +1ms',
    '  ERROR test 1970-01-01T00:00:00.016Z %d +1ms',
    '  ERROR test 1970-01-01T00:00:00.017Z hello world +1ms',
    '  ERROR test 1970-01-01T00:00:00.018Z digit 42.7 +1ms',
    '  ERROR test 1970-01-01T00:00:00.019Z json {"object":{"test":1},"msg":"the message"} +1ms',
    '  ERROR test 1970-01-01T00:00:00.020Z obj {"object":{"test":1},"msg":"the message"} +1ms',
    '  ERROR test 1970-01-01T00:00:00.021Z obj [1,2,3] +1ms',
    '  ERROR test 1970-01-01T00:00:00.022Z error {"status":500} +1ms',
    '  ERROR test 1970-01-01T00:00:00.023Z mixed % string 1.1 2.2 3.33 {"object":{"test":1},"msg":"the message"} {"status":500} +1ms',
    '  ERROR test 1970-01-01T00:00:00.024Z error message %s %% %d string 1.1 {\n' +
    '  ERROR test   "err": {\n' +
    '  ERROR test     "msg": "error message",\n' +
    '  ERROR test     "name": "TypeError",\n' +
    '  ERROR test     "stack": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile",\n' +
    '  ERROR test     "status": 500\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.025Z the message {\n' +
    '  ERROR test   "err": {\n' +
    '  ERROR test     "msg": "error message",\n' +
    '  ERROR test     "name": "TypeError",\n' +
    '  ERROR test     "stack": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile",\n' +
    '  ERROR test     "status": 500\n' +
    '  ERROR test   },\n' +
    '  ERROR test   "object": {\n' +
    '  ERROR test     "test": 1\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.026Z the message {\n' +
    '  ERROR test   "object": {\n' +
    '  ERROR test     "test": 1\n' +
    '  ERROR test   },\n' +
    '  ERROR test   "err": {\n' +
    '  ERROR test     "msg": "error message",\n' +
    '  ERROR test     "name": "TypeError",\n' +
    '  ERROR test     "stack": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile",\n' +
    '  ERROR test     "status": 500\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.027Z {\n' +
    '  ERROR test   "7123000": 7123000,\n' +
    '  ERROR test   "_abcdEF$01": "abcdef",\n' +
    '  ERROR test   "0.1234": 0.1234,\n' +
    '  ERROR test   "s p-a c e": "space",\n' +
    '  ERROR test   "\\"\'``\\"": "\\"\'``\\"",\n' +
    '  ERROR test   "\\"": "\\"",\n' +
    '  ERROR test   "\'": "\'"\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.028Z {\n' +
    '  ERROR test   "req": {\n' +
    '  ERROR test     "url": "/test",\n' +
    '  ERROR test     "ip": "10.10.10.10"\n' +
    '  ERROR test   }\n' +
    '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.029Z with level +1ms'
  ],
  json: [
    '{"level":"ERROR","time":0,"name":"test","msg":"string","diff":0}',
    '{"level":"ERROR","time":1,"name":"test","msg":"1","diff":0}',
    '{"level":"ERROR","time":2,"name":"test","msg":"false","diff":1}',
    '{"level":"ERROR","time":3,"name":"test","msg":"the message","diff":1,"object":{"test":1}}',
    '{"level":"ERROR","time":4,"name":"test","msg":"error message","diff":1,"err":{"msg":"error message","name":"TypeError","stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500}}',
    '{"level":"ERROR","time":5,"name":"test","msg":"string","diff":1}',
    '{"level":"ERROR","time":6,"name":"test","msg":"1","diff":1}',
    '{"level":"ERROR","time":7,"name":"test","msg":"false","diff":1}',
    '{"level":"ERROR","time":8,"name":"test","msg":"the message","diff":1,"object":{"test":1}}',
    '{"level":"ERROR","time":9,"name":"test","msg":"the message","diff":1,"object":{"test":1}}',
    '{"level":"ERROR","time":10,"name":"test","diff":1,"arr":[1,2,3]}',
    '{"level":"ERROR","time":11,"name":"test","msg":"error message","diff":1,"err":{"msg":"error message","name":"TypeError","stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500}}',
    '{"level":"ERROR","time":12,"name":"test","diff":1,"a":{"b":{"c":1},"e":"[Circular]"},"d":{"a":{"b":{"c":1},"e":"[Circular]"},"d":"[Circular]"}}',
    '{"level":"ERROR","time":13,"name":"test","msg":"null","diff":1}',
    '{"level":"ERROR","time":14,"name":"test","msg":"undefined","diff":1}',
    '{"level":"ERROR","time":15,"name":"test","msg":"%d","diff":1}',
    '{"level":"ERROR","time":16,"name":"test","msg":"%d","diff":1}',
    '{"level":"ERROR","time":17,"name":"test","msg":"hello world","diff":1}',
    '{"level":"ERROR","time":18,"name":"test","msg":"digit 42.7","diff":1}',
    '{"level":"ERROR","time":19,"name":"test","msg":"json {\\"object\\":{\\"test\\":1},\\"msg\\":\\"the message\\"}","diff":1}',
    '{"level":"ERROR","time":20,"name":"test","msg":"obj {\\"object\\":{\\"test\\":1},\\"msg\\":\\"the message\\"}","diff":1}',
    '{"level":"ERROR","time":21,"name":"test","msg":"obj [1,2,3]","diff":1}',
    '{"level":"ERROR","time":22,"name":"test","msg":"error {\\"status\\":500}","diff":1}',
    '{"level":"ERROR","time":23,"name":"test","msg":"mixed % string 1.1 2.2 3.33 {\\"object\\":{\\"test\\":1},\\"msg\\":\\"the message\\"} {\\"status\\":500}","diff":1}',
    '{"level":"ERROR","time":24,"name":"test","msg":"error message %s %% %d string 1.1","diff":1,"err":{"msg":"error message","name":"TypeError","stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500}}',
    '{"level":"ERROR","time":25,"name":"test","msg":"the message","diff":1,"err":{"msg":"error message","name":"TypeError","stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500},"object":{"test":1}}',
    '{"level":"ERROR","time":26,"name":"test","msg":"the message","diff":1,"object":{"test":1},"err":{"msg":"error message","name":"TypeError","stack":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile","status":500}}',
    '{"7123000":7123000,"level":"ERROR","time":27,"name":"test","diff":1,"_abcdEF$01":"abcdef","0.1234":0.1234,"s p-a c e":"space","\\"\'``\\"":"\\"\'``\\"","\\"":"\\"","\'":"\'"}',
    '{"level":"ERROR","time":28,"name":"test","diff":1,"req":{"url":"/test","ip":"10.10.10.10"}}',
    '{"level":"ERROR","time":29,"name":"test","msg":"with level","diff":1}'
  ]
}
