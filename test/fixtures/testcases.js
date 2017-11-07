const obj = {object: {test: 1}}
const arr = [1, 2 ,3]

const err = new TypeError('error message')
err.stack = 'TypeError: error message at Object.<anonymous> (./test/node.test.js:9:13) at Module._compile' // shortened stack
err.status = 500

const circular = {a: {b: {c: 1}}}
circular.d = circular
circular.a.e = circular.a

const quotes = {
  _abcdEF$01: 'abcdef',
  .1234: .1234,
  7.123e6: 7.123e6,
  's p-a c e': 'space',
  '"\'``"': '"\'``"',
  '"': '"',
  '\'': '\''
}

function Custom (url) {
  Object.assign(this, {
    url,
    ip: '10.10.10.10',
    headers: {'User-Agent': 'Custom/2.0'},
    other: {obj, arr, circular}
  })
}
Custom.prototype = {
  toJSON () {
    const {url, ip} = this
    return {url, ip}
  }
}

const custom = new Custom('/test')

const testcases = [
  { name: 'string',     args: [ 'string' ] },
  { name: 'number',     args: [ 1 ] },
  { name: 'boolean',    args: [ false ] },
  { name: 'object',     args: [ obj ] },
  { name: 'error',      args: [ err ] },
  { name: '%s',         args: [ '%s', 'string' ] },
  { name: '%d',         args: [ 1 ] },
  { name: '%s',         args: [ false ] },
  { name: '%j',         args: [ obj ] },
  { name: '%o',         args: [ obj ] },
  { name: '%O',         args: [ arr ] },
  { name: '%O',         args: [ err ] },
  { name: 'circular',   args: [ circular ] },
  { name: 'null %s',    args: [ '%s', null ] },
  { name: 'undefined %s', args: [ '%s', undefined ] },
  { name: 'null %d', args: [ '%d', null ] },
  { name: 'undefined %d', args: [ '%d', undefined ] },
  { name: 'string %s',  args: [ 'hello %s', 'world' ] },
  { name: 'number %d',  args: [ 'digit %d', 42.7 ] },
  { name: 'number %i',  args: [ 'integer %i', 42.7 ] },
  { name: 'number %f',  args: [ 'float %f', 42.666 ] },
  { name: 'json %j',    args: [ 'json %j', obj ] },
  { name: 'obj %o',     args: [ 'obj %o', obj ] },
  { name: 'obj %O',     args: [ 'obj %O', arr ] },
  { name: 'error %O',   args: [ 'error %O', err ] },
  { name: 'mixed %',    args: [ 'mixed %% %s %d %i %f %j %O', 'string', 1.1, 2.2, 3.33, obj, err] },
  { name: 'error %s %d', args: [ err, '%s %% %d', 'string', 1.1] },
  { name: 'error obj %s %d', args: [ err, obj, '%s %% %d', 'string', 1.1] },
  { name: '%s %d obj err', args: [ '%s %% %d', 'string', 1.1, obj, err] },
  { name: 'quotes %o',  args: [ quotes] },
  { name: 'custom',  args: [ custom ]}
]

module.exports = {
  testcases,
  obj, err, arr, circular, quotes, custom
}
