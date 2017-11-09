# debug-level

> debug with levels

A JavaScript logging/ debugging utility which works in node and browsers. It behaves similar to the popular [debug][] module but adds additional log levels.  
Prints colored and human readable output for development and JSON for production environments.

## TOC

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [TOC](#toc)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Settings](#settings)
	- [Environment Variables](#environment-variables)
	- [Options](#options)
- [Namespaces](#namespaces)
	- [Conventions](#conventions)
	- [Wildcards](#wildcards)
- [Custom Formatters](#custom-formatters)
- [License](#license)
- [References](#references)

<!-- /TOC -->

## Installation

```
$ npm install --save debug-level
```

## Usage

`debug-level` provides 4 debug levels which are `DEBUG`, `INFO`, `WARN` and `ERROR`.

[examples/levels.js](./examples/levels.js)

```js
const Log = require('debug-level')
// creates a logger for <namespace> `test`
const log = new Log('test')

log.debug({object: 1})               // logs an object at level DEBUG
log.info('%s world', 'hello')        // logs a formatted string at level INFO
log.warn('huh %o', {ghost: 'rider'}) // logs a formatted object at level WARN
log.error(new Error('boom'))         // logs an Error at level ERROR
```

Running `levels.js` without environment variables will show no output.
Setting only `DEBUG_LEVEL` shows all lines with their respective level.
Combined with `DEBUG`, using comma separated namespaces, only those log lines with matching namespace and level get logged.

e.g. try

```sh
$ DEBUG_LEVEL=WARN DEBUG=test node examples/levels.js
```

The following table gives an overview of possible combinations:

DEBUG_LEVEL | DEBUG         | writing to output
:----------:| :-----------: | :--------
--          | --            | no output
ERROR       | --            | only log.error
WARN        | --            | log.error, log.warn
INFO        | --            | log.error, log.warn and log.info
DEBUG       | --            | log.error, log.warn, log.info and log.debug
--          | `<namespace>` | log.error, log.warn, log.info and log.debug which apply to `<namespace>` <br> same behaviour as `debug`
ERROR       | `<namespace>` | log.error with `<namespace>`
WARN        | `<namespace>` | log.error, log.warn with `<namespace>`
INFO        | `<namespace>` | log.error, log.warn, log.info with `<namespace>`
DEBUG       | `<namespace>` | log.error, log.warn, log.info and log.debug with `<namespace>`

## Examples

Run the example with different settings:

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

Behaviour is as with [debug][]

```sh
$ DEBUG=server,client:A node examples/server.js
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
level       | DEBUG_LEVEL     |         | String  |                  
namespaces  | DEBUG           |         | String  |                  
json        | DEBUG_JSON      | node    | Boolean |                  
spaces      | DEBUG_SPACES    | node    | Number  | JSON spaces      
hideDate    | DEBUG_HIDE_DATE |         | Boolean |                  
colors      | DEBUG_COLORS    |         | Boolean |                  
stream      | --              | node    | Stream  | output stream (defaults to `process.stderr`)                 
url         | DEBUG_URL       | browser | String  |                  
formatters  | --              |         | Object  | custom formatters

## Namespaces

### Conventions

(from [debug][])

If you're using this in one or more of your libraries, you should use the name of your library so that developers may toggle debugging as desired without guessing names. If you have more than one debuggers you should prefix them with your library name and use ":" to separate features. For example `bodyParser` from Connect would then be `connect:bodyParser`. If you append a `*` to the end of your name, it will always be enabled regardless of the setting of the DEBUG environment variable. You can then use it for normal output as well as debug output.

### Wildcards

(from [debug][])

The `*` character may be used as a wildcard. Suppose for example your library has debuggers named `connect:bodyParser`, `connect:compress`, `connect:session`, instead of listing all three with `DEBUG=connect:bodyParser,connect:compress,connect:session`, you may simply do `DEBUG=connect:*`, or to run everything using this module simply use `DEBUG=*`.

You can also exclude specific debuggers by prefixing them with a `-` character. For example, `DEBUG=*,-connect:*` would include all debuggers except those starting with `connect:`.

## Custom Formatters

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
  headers: {'User-Agent': 'Custom/2.0'}, connection: {/* ... */}
}
req.toJSON = reqToJSON.bind(req)

log.debug(req)
//> DEBUG * {"ip":"10.10.10.10","method":"GET","url":"/path"} +0ms
```

## License

[MIT](./LICENSE)

## References

- [debug][]

[debug]: https://github.com/visionmedia/debug
