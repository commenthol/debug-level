
### Basic String

`log.debug('hello world')`

```
benchDebug*10000: 55.741ms
benchBunyan*10000: 61.139ms
benchPino*10000: 26.303ms
benchDebugLevel*10000: 37.721ms
benchPinoAsync*10000: 19.075ms
benchDebugLevelAsync*10000: 20.367ms

```

### Long String 2000 chars

`log.debug('...2000chars...')`

```
benchDebug*10000: 195.256ms
benchBunyan*10000: 135.5ms
benchPino*10000: 99.814ms
benchDebugLevel*10000: 102.025ms
benchPinoAsync*10000: 76.768ms
benchDebugLevelAsync*10000: 72.546ms

```

### Hello World with %s format

`log.debug('hello %s', 'world')`

```
benchDebug*10000: 66.129ms
benchBunyan*10000: 64.444ms
benchPino*10000: 28.942ms
benchDebugLevel*10000: 37.615ms
benchPinoAsync*10000: 19.842ms
benchDebugLevelAsync*10000: 22.182ms

```

### Multi Argument format

`log.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })`

```
benchDebug*10000: 76.226ms
benchBunyan*10000: 112.486ms
benchPino*10000: 40.705ms
benchDebugLevel*10000: 58.128ms
benchPinoAsync*10000: 26.783ms
benchDebugLevelAsync*10000: 39.376ms

```

### Object

`log.debug({ msg: 'the message',string: 'string',number: 42,bool: true })`

```
benchDebug*10000: 129.951ms
benchBunyan*10000: 74.592ms
benchPino*10000: 34.077ms
benchDebugLevel*10000: 58.722ms
benchPinoAsync*10000: 24.508ms
benchDebugLevelAsync*10000: 33.743ms

```

### Deep Object

`log.debug(deep)`

```
benchDebug*10000: 1.638s
benchBunyan*10000: 526.719ms
benchPino*10000: 468.903ms
benchDebugLevel*10000: 504.314ms
benchPinoAsync*10000: 376.583ms
benchDebugLevelAsync*10000: 399.692ms

```

### Deep Object with %j format

`log.debug('deep %j', deep)`

```
benchDebug*10000: 67.072ms
benchBunyan*10000: 663.877ms
benchPino*10000: 607.992ms
benchDebugLevel*10000: 695.806ms
benchPinoAsync*10000: 488.678ms
benchDebugLevelAsync*10000: 578.393ms

```
