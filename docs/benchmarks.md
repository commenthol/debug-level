
### Basic String

`log.debug('hello world')`

```
benchDebug*10000: 60.468ms
benchBunyan*10000: 66.615ms
benchPino*10000: 27.886ms
benchDebugLevel*10000: 37.647ms
benchPinoAsync*10000: 19.794ms
benchDebugLevelAsync*10000: 22.372ms

```

### Long String 2000 chars

`log.debug('...2000chars...')`

```
benchDebug*10000: 166.238ms
benchBunyan*10000: 145.655ms
benchPino*10000: 111.212ms
benchDebugLevel*10000: 110.825ms
benchPinoAsync*10000: 75.158ms
benchDebugLevelAsync*10000: 81.625ms

```

### Hello World with %s format

`log.debug('hello %s', 'world')`

```
benchDebug*10000: 70.632ms
benchBunyan*10000: 69.61ms
benchPino*10000: 29.191ms
benchDebugLevel*10000: 38.548ms
benchPinoAsync*10000: 20.506ms
benchDebugLevelAsync*10000: 22.691ms

```

### Multi Argument format

`log.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })`

```
benchDebug*10000: 85.442ms
benchBunyan*10000: 131.823ms
benchPino*10000: 44.803ms
benchDebugLevel*10000: 51.084ms
benchPinoAsync*10000: 27.944ms
benchDebugLevelAsync*10000: 35.4ms

```

### Object

`log.debug({ msg: 'the message',string: 'string',number: 42,bool: true })`

```
benchDebug*10000: 127.809ms
benchBunyan*10000: 73.611ms
benchPino*10000: 35.428ms
benchDebugLevel*10000: 50.74ms
benchPinoAsync*10000: 24.362ms
benchDebugLevelAsync*10000: 33.806ms

```

### Deep Object

`log.debug(deep)`

```
benchDebug*10000: 1.605s
benchBunyan*10000: 516.705ms
benchPino*10000: 455.162ms
benchDebugLevel*10000: 537.267ms
benchPinoAsync*10000: 386.146ms
benchDebugLevelAsync*10000: 483.032ms

```

### Deep Object with %j format

`log.debug('deep %j', deep)`

```
benchDebug*10000: 73.44ms
benchBunyan*10000: 760.134ms
benchPino*10000: 679.265ms
benchDebugLevel*10000: 727.769ms
benchPinoAsync*10000: 506.954ms
benchDebugLevelAsync*10000: 649.465ms

```
