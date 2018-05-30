# debug-level

> debug with levels

[![NPM version](https://badge.fury.io/js/debug-level.svg)](https://www.npmjs.com/package/debug-level/)
[![Build Status](https://secure.travis-ci.org/commenthol/debug-level.svg?branch=master)](https://travis-ci.org/commenthol/debug-level)
[![Coverage Status](https://coveralls.io/repos/github/commenthol/debug-level/badge.svg?branch=master)](https://coveralls.io/github/commenthol/debug-level?branch=master)

A universal JavaScript logging/ debugging utility which works in node and browsers. It behaves similar to the popular [debug][] module but adds additional log levels.
Prints colored and human readable output for development and [bunyan][] like JSON for production environments.

*human readable format for development*

![debug server development][debug-level-dev.png]

*machine readable with colors*

![debug server development][debug-level-dev-json.png]

*machine readable for production use*

![debug server development][debug-level-prod.png]

**Table of Contents**

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Settings](#settings)
	- [Environment Variables](#environment-variables)
	- [Options](#options)
- [Levels](#levels)
- [Namespaces](#namespaces)
	- [Conventions](#conventions)
	- [Wildcards](#wildcards)
- [Output](#output)
	- [JSON output](#json-output)
	- [Custom Formatters](#custom-formatters)
	- [toJSON](#tojson)
- [Logging Browser messages](#logging-browser-messages)
- [License](#license)
- [References](#references)

<!-- /TOC -->

## Installation

```
$ npm install --save debug-level
```

## Usage

`debug-level` provides 6 log levels which are `DEBUG`, `INFO`, `WARN`, `ERROR`,
`FATAL` and `OFF`.

Each level has a corresponding method `DEBUG` -> `log.debug` ... `FATAL` -->
`log.fatal` which shall be used to indicated the level to log.

The characters `%s`, `%d`, `%i`, `%f`, `%j`, `%o`, `%O`, `%%` are supported [formatters](https://nodejs.org/api/util.html#util_util_format_format_args) when
given in the first argument.

[examples/levels.js](./examples/levels.js)

```js
const Log = require('debug-level')
// creates a logger for <namespace> `test`
const log = new Log('test')

// or using a global Log instance
const log = require('debug-level').log('test')

log.fatal(new Error('fatal'))        // logs an Error at level FATAL
log.error(new Error('boom'))         // logs an Error at level ERROR
log.warn('huh %o', {ghost: 'rider'}) // logs a formatted object at level WARN
log.info('%s world', 'hello')        // logs a formatted string at level INFO
log.debug({object: 1})               // logs an object at level DEBUG
log.log('always logs')               // always logs regardless of set level
```

Running `levels.js` without environment variables will show no output (apart from `log.log`).
Setting only `DEBUG_LEVEL` shows all lines with their respective level.
Combined with `DEBUG`, using comma separated [namespaces](#namespaces), only
those log lines with matching namespace and level get logged.

The following table gives an overview of possible combinations:

DEBUG_LEVEL | DEBUG          | Output
:----------:| :------------: | :----------------
--          | --             | no output
FATAL       | --             | logs only log.fatal
ERROR       | --             | log.fatal, log.error
WARN        | --             | log.fatal, log.error, log.warn
INFO        | --             | log.fatal, log.error, log.warn and log.info
DEBUG       | --             | log.fatal, log.error, log.warn, log.info and log.debug
--          | `<namespaces>`   | log.fatal, to log.debug which apply to `<namespaces>`. <br> Same behavior as [debug][].
FATAL       | `<namespaces>`   | log.fatal for all `<namespaces>` only
ERROR       | `<namespaces>`   | log.fatal, log.error for `<namespaces>` only
WARN        | `<namespaces>`   | log.fatal, to log.warn for `<namespaces>` only
INFO        | `<namespaces>`   | log.fatal, to log.info for `<namespaces>` only
DEBUG       | `<namespaces>`   | log.fatal, to log.debug for `<namespaces>` only
--          | `ERROR:n1,DEBUG:n2,FATAL:*` | Logs namespace `n1` at level `ERROR`, namespace `n2` at level `DEBUG` and all other namespaces (`*`) at level `FATAL`
FATAL       | `ERROR:n1,n2` | Logs `n1` at level `ERROR`, `n2` at level `FATAL`. All other namespaces will **NOT** get logged

## Examples

Run the [server.js](./examples/server.js) example with different settings:

No output

```sh
$ node examples/server.js
```

Logging .info and .error

```sh
$ DEBUG_LEVEL=INFO node examples/server.js
```

Logging .error for server only

```sh
$ DEBUG_LEVEL=ERROR DEBUG=server node examples/server.js
```

Logging .error in production mode (JSON without colors)

```sh
$ NODE_ENV=production DEBUG_LEVEL=ERROR node examples/server.js
```

Behavior is as with [debug][].

```sh
$ DEBUG=server,client:A node examples/server.js
```

Log `server` at level `INFO`, and all other modules at level `ERROR`

```sh
$ DEBUG=INFO:server,ERROR:* node examples/server.js
```

## Settings

### Environment Variables

**Common**

Setting          | Values         | Description
----             | ----           | ----
DEBUG            | <namespace>    | Enables/disables specific debugging namespaces
DEBUG_LEVEL      | ERROR, WARN, INFO, DEBUG | sets debug level
DEBUG_COLORS     | **true**/false | display colors (if supported)

**Node only**

Setting          | Values         | `NODE_ENV=`<br>`development` | Description
----             | ----           | ----  | ----
DEBUG_JSON       | **true**/false | false | use JSON format instead of string based log
DEBUG_SERVERINFO | **true**/false | false | adds server information like `pid` and `hostname`
DEBUG_HIDE_DATE  | **true**/false | false | hides date from log output default false

For `NODE_ENV !== 'development'` the default logging is in JSON format using serverinfo and date.

**Browsers only**

Setting          | Values         | Description
----             | ----           | ----
DEBUG_URL        | URL            | log in JSON format to server (needs `middleware.js` at the server side)

In the browser `localStorage` is used to set/save the settings.
E.g. to enable level ERROR an all namespaces type in console and refresh your page/ app:

```
localStorage.DEBUG_LEVEL='ERROR'
localStorage.DEBUG='*'
```

### Options

You may set the global log options with:

[examples/options.js](./examples/options.js)

```js
const fs = require('fs')
const Log = require('debug-level')

// log into file instead of process.stderr
const stream = fs.createWriteStream('./my.log')

// The options will be set for all Loggers...
Log.options({
  level: 'DEBUG',
  json: true,
  serverinfo: true,
  hideDate: false,
  colors: false,
  stream
})
const log = new Log('*')

log.debug({object: 1}) // ...
```

Option name | Setting         | env     | Type    | Description
-----       | ----            | ----    | ----    | ----
level       | DEBUG_LEVEL     | _both_  | String  |
namespaces  | DEBUG           | _both_  | String  |
json        | DEBUG_JSON      | node    | Boolean |
spaces      | DEBUG_SPACES    | node    | Number  | JSON spaces
hideDate    | DEBUG_HIDE_DATE | _both_  | Boolean |
colors      | DEBUG_COLORS    | _both_  | Boolean |
stream      | --              | node    | Stream  | output stream (defaults to `process.stderr`)
url         | DEBUG_URL       | browser | String  |
formatters  | --              | _both_  | Object  | custom formatters

## Levels

(From [bunyan][])

- `FATAL`: The service/app is going to stop or becomes unusable.
   An operator should definitely look into this soon.
- `ERROR`: Fatal for a particular request, but the service/app continues servicing.
  An operator should look at this soon(ish)
- `WARN`: A note on something that should probably be looked at by an operator eventually.
- `INFO`: Detail on regular operation.
- `DEBUG`: Anything else, i.e. too verbose to be included in `INFO` level.

## Namespaces

Namespaces select dedicated packages for logging (check [Conventions](#conventions))
considering the level selected with `DEBUG_LEVEL`. To choose a different log-level
prefix the namespace with the level to be set for that namespace.

E.g. to log all packages on level `FATAL`, `test` on `ERROR`, `log:A` on `WARN`. As a side-effect `*` will also cause **all** modules using [debug][] being logged.

```
$ DEBUG_LEVEL=FATAL DEBUG=ERROR:test,WARN:log:A,* node examples/levels.js
  ERROR test Error: boom
  FATAL test fatal test +7ms
  WARN log:A huh {"ghost":"rider"} +0ms
  ERROR log:A Error: baam
  FATAL log:A fatal A +1ms
  FATAL log:B fatal B +0ms
  using-debug using debug +0ms
  using-debug:A using debug - feature A +1ms
```

So maybe consider using `DEBUG=...,FATAL:*` instead:

```
$ DEBUG=ERROR:test,WARN:log:A,FATAL:*,using-debug:* node examples/levels.js
  ERROR test Error: boom
  FATAL test fatal test +7ms
  WARN log:A huh {"ghost":"rider"} +0ms
  ERROR log:A Error: baam
  FATAL log:A fatal A +1ms
  FATAL log:B fatal B +0ms
  using-debug:A using debug - feature A +1ms
```

### Conventions

(from [debug][])

If you're using this in one or more of your libraries, you should use the name of
your library so that developers may toggle debugging as desired without guessing
names. If you have more than one debuggers you should prefix them with your
package name and use ":" to separate features. For example `bodyParser` from
Connect would then be `connect:bodyParser`. If you append a `*` to the end of
your name, it will always be enabled regardless of the setting of the DEBUG
environment variable. You can then use it for normal output as well as debug output.

### Wildcards

(from [debug][])

The `*` character may be used as a wildcard. Suppose for example your library
has debuggers named `connect:bodyParser`, `connect:compress`, `connect:session`,
instead of listing all three with `DEBUG=connect:bodyParser,connect:compress,connect:session`,
you may simply do `DEBUG=connect:*`, or to run everything using this module
simply use `DEBUG=*`.

You can also exclude specific debuggers by prefixing them with a `-` character.
For example, `DEBUG=*,-connect:*` would include all debuggers except those starting with `connect:`.

## Output

`debug-level` supports two types of outputs

1. human readable - this pretty much follows the output of [debug][]
   This is the default for `NODE_ENV=development`. Can be forced using `DEBUG_JSON=0`
2. machine readable - JSON output (similar to [bunyan][])
   This is the default for test/production envs. Can be forced using `DEBUG_JSON=1`

### JSON output

When using `%j`, `%o`, `%O` all will expand to `%j` JSON, so there is no difference when using in node.

Nonetheless it is **not recommended to use** these formatters for logging errors and objects as this complicates later log inspection.

Each log records into a single JSON stringified line.

Core fields are:

- `level`: One of the five log levels.
- `name`: The name of the namespace logged.
- `msg`: A message which should give reason for logging the line.
- `hostname`: Hostname of the server. (Requires option serverinfo)
- `pid`: PID of the logged process. (Requires option serverinfo).
- `time`: Timestamp (Suppress with option hideDate).
- `diff`: Difftime in milliseconds.

See [examples/jsonOutput.js](./examples/jsonOutput.js).

When logging a message string, number or a formatted string it will show up under `msg` like:

```js
log.debug('a %s, a number %d, an %o and %j', 'string', 1.2, {object: 1}, {NOT: 'RECOMMENDED'})
// >
{ "level": "DEBUG",           // log level
  "name": "package:feature",  // the namespace of the logger
  "msg": "a string, a number 1.2, an {\"object\":1} and {\"NOT\":\"RECOMMENDED\"}", // the formatted message
  "hostname": "server",       // server hostname
  "pid": 8310,                // process pid
  "time": "2017-11-08T21:01:00.025Z", // timestamp as ISOString
  "diff": 5                   // difftime in ms
}
```

Objects without formatters get assigned, arrays will show up under `arr`:

```js
log.info({object: 1}, {json: true}, [1, 2, 3], '%s #%d', 'message', 1)
// >
{ "level": "INFO",
  "name": "package:feature",
	"msg": "message #1"
  "object": 1,
	"json": true,
  "arr": [1,2,3],
  "time": "2017-11-09T21:09:49.482Z",
  "diff": 0
}
```

An error gets logged under `err`

```js
const err = new TypeError('bam')
err.status = 500
log.error(err, {object: 1}) // you may add an additional object
// >
{ "level":"ERROR",
  "name":"package:feature",
	"msg":"bam",
  "err": { // the error object
    "name":"TypeError",
    "stack":"Error: bam\n    at Object.<anonymous> (...\n    at bootstrap_node.js:608:3",
    "status": 500
  },
  "object": 1,
  "time":"2017-11-09T21:16:16.764Z",
  "diff":0
}
```

### Custom formatters

You may use custom formatters e.g. to display numbers converted into hex-format.

[examples/customFormatters.js](./examples/customFormatters.js)

```js
const Log = require('..')
Log.options({level: 'debug'})
const log = new Log('test', {formatters: {
  h: (n) => `x${n.toString(16).toUpperCase()}`
}})

log.debug('%h', 255) // logs 255 as hex 'xFF'
```

### toJSON

If logging an object you may define a `toJSON()` function on that object to change proper logging of the object itself:

[examples/toJSON.js](./examples/toJSON.js)

```js
const Log = require('debug-level')
const log = new Log('*')

function reqToJSON () {
  const {ip, method, url} = this
  return {ip, method, url}
}

// assume a request obj
const req = {
  method: 'GET', url: '/path', ip: '10.10.10.10',
  headers: {'user-agent': 'Custom/2.0'}, connection: {/* ... */}
}
req.toJSON = reqToJSON.bind(req)

log.debug({req: req})
//> DEBUG * {"req":{"ip":"10.10.10.10","method":"GET","url":"/path"}} +0ms
```

## Logging Browser messages

To log debug messages from the browser on your server you can enable a logger middleware in your express/ connect server.

```js
const app = require('express')()
const {logger} = require('debug-level')

app.use('./debug-level', logger({maxSize: 100}))
...
```

In your single page application use:

```js
import Log from 'debug-level'

localStorage.setItem('DEBUG_URL', '/debug-level')
localStorage.setItem('DEBUG', 'myApp*')
// ...
const log = new Log('myApp')

log.debug('my first %s', 'logline')
```

Check example at `examples/app`. To run it use:

```bash
DEBUG=* node examples/app/server.js
```

and open <http://localhost:3000>

## License

[MIT](./LICENSE)

## References

- [debug][]
- [bunyan][]

[bunyan]: https://www.npmjs.com/package/bunyan
[debug]: https://www.npmjs.com/package/debug

[debug-level-dev.png]: https://raw.githubusercontent.com/commenthol/debug-level/master/docs/debug-level-dev.png
[debug-level-dev-json.png]: https://raw.githubusercontent.com/commenthol/debug-level/master/docs/debug-level-dev-json.png
[debug-level-prod.png]: https://raw.githubusercontent.com/commenthol/debug-level/master/docs/debug-level-prod.png
