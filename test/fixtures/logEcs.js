export default {
  debug: [
    '  ERROR test 1970-01-01T00:00:00.000Z string +0ms',
    '  ERROR test 1970-01-01T00:00:00.001Z 1 +0ms',
    '  ERROR test 1970-01-01T00:00:00.002Z false +1ms',
    '  ERROR test 1970-01-01T00:00:00.003Z the message {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "object": {\n' +
      '  ERROR test         "test": 1\n' +
      '  ERROR test       }\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.004Z error message {\n' +
      '  ERROR test   "error": {\n' +
      '  ERROR test     "type": "TypeError",\n' +
      '  ERROR test     "message": "error message",\n' +
      '  ERROR test     "stack_trace": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.005Z string +1ms',
    '  ERROR test 1970-01-01T00:00:00.006Z 1 +1ms',
    '  ERROR test 1970-01-01T00:00:00.007Z false +1ms',
    '  ERROR test 1970-01-01T00:00:00.008Z the message {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "object": {\n' +
      '  ERROR test         "test": 1\n' +
      '  ERROR test       }\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.009Z the message {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "object": {\n' +
      '  ERROR test         "test": 1\n' +
      '  ERROR test       }\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.010Z {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "arr": [\n' +
      '  ERROR test         1,\n' +
      '  ERROR test         2,\n' +
      '  ERROR test         3\n' +
      '  ERROR test       ]\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.011Z error message {\n' +
      '  ERROR test   "error": {\n' +
      '  ERROR test     "type": "TypeError",\n' +
      '  ERROR test     "message": "error message",\n' +
      '  ERROR test     "stack_trace": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.012Z {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "a": {\n' +
      '  ERROR test         "b": {\n' +
      '  ERROR test           "c": 1\n' +
      '  ERROR test         },\n' +
      '  ERROR test         "e": "[Circular]"\n' +
      '  ERROR test       },\n' +
      '  ERROR test       "d": {\n' +
      '  ERROR test         "a": {\n' +
      '  ERROR test           "b": {\n' +
      '  ERROR test             "c": 1\n' +
      '  ERROR test           },\n' +
      '  ERROR test           "e": "[Circular]"\n' +
      '  ERROR test         },\n' +
      '  ERROR test         "d": "[Circular]"\n' +
      '  ERROR test       }\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.013Z null +1ms',
    '  ERROR test 1970-01-01T00:00:00.014Z undefined +1ms',
    '  ERROR test 1970-01-01T00:00:00.015Z %d +1ms',
    '  ERROR test 1970-01-01T00:00:00.016Z %d +1ms',
    '  ERROR test 1970-01-01T00:00:00.017Z hello world +1ms',
    '  ERROR test 1970-01-01T00:00:00.018Z digit 42.7 +1ms',
    '  ERROR test 1970-01-01T00:00:00.019Z json {\n' +
      '  ERROR test   "object": {\n' +
      '  ERROR test     "test": 1\n' +
      '  ERROR test   },\n' +
      '  ERROR test   "msg": "the message"\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.020Z obj {\n' +
      '  ERROR test   "object": {\n' +
      '  ERROR test     "test": 1\n' +
      '  ERROR test   },\n' +
      '  ERROR test   "msg": "the message"\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.021Z obj [\n' +
      '  ERROR test   1,\n' +
      '  ERROR test   2,\n' +
      '  ERROR test   3\n' +
      '  ERROR test ] +1ms',
    '  ERROR test 1970-01-01T00:00:00.022Z error {\n' +
      '  ERROR test   "status": 500\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.023Z mixed % string 1.1 2.2 3.33 {\n' +
      '  ERROR test   "object": {\n' +
      '  ERROR test     "test": 1\n' +
      '  ERROR test   },\n' +
      '  ERROR test   "msg": "the message"\n' +
      '  ERROR test } {\n' +
      '  ERROR test   "status": 500\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.024Z error message %s %% %d string 1.1 {\n' +
      '  ERROR test   "error": {\n' +
      '  ERROR test     "type": "TypeError",\n' +
      '  ERROR test     "message": "error message",\n' +
      '  ERROR test     "stack_trace": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.025Z the message {\n' +
      '  ERROR test   "error": {\n' +
      '  ERROR test     "type": "TypeError",\n' +
      '  ERROR test     "message": "error message",\n' +
      '  ERROR test     "stack_trace": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"\n' +
      '  ERROR test   },\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "object": {\n' +
      '  ERROR test         "test": 1\n' +
      '  ERROR test       }\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.026Z the message {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "object": {\n' +
      '  ERROR test         "test": 1\n' +
      '  ERROR test       }\n' +
      '  ERROR test     }\n' +
      '  ERROR test   },\n' +
      '  ERROR test   "error": {\n' +
      '  ERROR test     "type": "TypeError",\n' +
      '  ERROR test     "message": "error message",\n' +
      '  ERROR test     "stack_trace": "TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.027Z {\n' +
      '  ERROR test   "extra": {\n' +
      '  ERROR test     "test": {\n' +
      '  ERROR test       "7123000": 7123000,\n' +
      '  ERROR test       "_abcdEF$01": "abcdef",\n' +
      '  ERROR test       "0.1234": 0.1234,\n' +
      '  ERROR test       "s p-a c e": "space",\n' +
      '  ERROR test       "\\"\'``\\"": "\\"\'``\\"",\n' +
      '  ERROR test       "\\"": "\\"",\n' +
      '  ERROR test       "\'": "\'"\n' +
      '  ERROR test     }\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.028Z {\n' +
      '  ERROR test   "client": {\n' +
      '  ERROR test     "ip": "10.10.10.10"\n' +
      '  ERROR test   },\n' +
      '  ERROR test   "url": {\n' +
      '  ERROR test     "path": "/test"\n' +
      '  ERROR test   }\n' +
      '  ERROR test } +1ms',
    '  ERROR test 1970-01-01T00:00:00.029Z with level +1ms'
  ],
  json: [
    '{"log":{"level":"ERROR","logger":"test","diff_ms":0},"message":"string","@timestamp":"1970-01-01T00:00:00.000Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":0},"message":"1","@timestamp":"1970-01-01T00:00:00.001Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"false","@timestamp":"1970-01-01T00:00:00.002Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"the message","@timestamp":"1970-01-01T00:00:00.003Z","extra":{"test":{"object":{"test":1}}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"error message","@timestamp":"1970-01-01T00:00:00.004Z","error":{"type":"TypeError","message":"error message","stack_trace":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"string","@timestamp":"1970-01-01T00:00:00.005Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"1","@timestamp":"1970-01-01T00:00:00.006Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"false","@timestamp":"1970-01-01T00:00:00.007Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"the message","@timestamp":"1970-01-01T00:00:00.008Z","extra":{"test":{"object":{"test":1}}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"the message","@timestamp":"1970-01-01T00:00:00.009Z","extra":{"test":{"object":{"test":1}}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"@timestamp":"1970-01-01T00:00:00.010Z","extra":{"test":{"arr":[1,2,3]}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"error message","@timestamp":"1970-01-01T00:00:00.011Z","error":{"type":"TypeError","message":"error message","stack_trace":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"@timestamp":"1970-01-01T00:00:00.012Z","extra":{"test":{"a":{"b":{"c":1},"e":"[Circular]"},"d":{"a":{"b":{"c":1},"e":"[Circular]"},"d":"[Circular]"}}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"null","@timestamp":"1970-01-01T00:00:00.013Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"undefined","@timestamp":"1970-01-01T00:00:00.014Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"%d","@timestamp":"1970-01-01T00:00:00.015Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"%d","@timestamp":"1970-01-01T00:00:00.016Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"hello world","@timestamp":"1970-01-01T00:00:00.017Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"digit 42.7","@timestamp":"1970-01-01T00:00:00.018Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"json {\\"object\\":{\\"test\\":1},\\"msg\\":\\"the message\\"}","@timestamp":"1970-01-01T00:00:00.019Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"obj {\\"object\\":{\\"test\\":1},\\"msg\\":\\"the message\\"}","@timestamp":"1970-01-01T00:00:00.020Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"obj [1,2,3]","@timestamp":"1970-01-01T00:00:00.021Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"error {\\"status\\":500}","@timestamp":"1970-01-01T00:00:00.022Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"mixed % string 1.1 2.2 3.33 {\\"object\\":{\\"test\\":1},\\"msg\\":\\"the message\\"} {\\"status\\":500}","@timestamp":"1970-01-01T00:00:00.023Z"}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"error message %s %% %d string 1.1","@timestamp":"1970-01-01T00:00:00.024Z","error":{"type":"TypeError","message":"error message","stack_trace":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"the message","@timestamp":"1970-01-01T00:00:00.025Z","error":{"type":"TypeError","message":"error message","stack_trace":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"},"extra":{"test":{"object":{"test":1}}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"the message","@timestamp":"1970-01-01T00:00:00.026Z","extra":{"test":{"object":{"test":1}}},"error":{"type":"TypeError","message":"error message","stack_trace":"TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile"}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"@timestamp":"1970-01-01T00:00:00.027Z","extra":{"test":{"7123000":7123000,"_abcdEF$01":"abcdef","0.1234":0.1234,"s p-a c e":"space","\\"\'``\\"":"\\"\'``\\"","\\"":"\\"","\'":"\'"}}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"@timestamp":"1970-01-01T00:00:00.028Z","client":{"ip":"10.10.10.10"},"url":{"path":"/test"}}',
    '{"log":{"level":"ERROR","logger":"test","diff_ms":1},"message":"with level","@timestamp":"1970-01-01T00:00:00.029Z"}'
  ]
}
