
### Basic String

`log.debug('hello world')`

```
benchDebug*10000: 23.423ms
benchBunyan*10000: 25.634ms
benchPino*10000: 9.619ms
benchDebugLevel*10000: 19.821ms
benchPinoAsync*10000: 8.892ms
benchDebugLevelAsync*10000: 10.998ms

```

### Long String 2000 chars

`log.debug('...2000chars...')`

```
benchDebug*10000: 76.483ms
benchBunyan*10000: 83.973ms
benchPino*10000: 75.299ms
benchDebugLevel*10000: 95.44ms
benchPinoAsync*10000: 81.941ms
benchDebugLevelAsync*10000: 63.656ms

```

### Hello World with %s format

`log.debug('hello %s', 'world')`

```
benchDebug*10000: 22.46ms
benchBunyan*10000: 25.477ms
benchPino*10000: 10.787ms
benchDebugLevel*10000: 29.386ms
benchPinoAsync*10000: 10.147ms
benchDebugLevelAsync*10000: 14.039ms

```

### Multi Argument format

`log.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })`

```
benchDebug*10000: 24.282ms
benchBunyan*10000: 37.851ms
benchPino*10000: 16.485ms
benchDebugLevel*10000: 24.695ms
benchPinoAsync*10000: 14.521ms
benchDebugLevelAsync*10000: 20.715ms

```

### Object

`log.debug({ msg: 'the message',string: 'string',number: 42,bool: true })`

```
benchDebug*10000: 39.002ms
benchBunyan*10000: 27.534ms
benchPino*10000: 14.266ms
benchDebugLevel*10000: 20.081ms
benchPinoAsync*10000: 11.325ms
benchDebugLevelAsync*10000: 16.31ms

```

### Deep Object

`log.debug(deep)`

```
benchDebug*10000: 1.340s
benchBunyan*10000: 474.926ms
benchPino*10000: 455.004ms
benchDebugLevel*10000: 476.143ms
benchPinoAsync*10000: 281.14ms
benchDebugLevelAsync*10000: 299.743ms

```

### Deep Object with %j format

`log.debug('deep %j', deep)`

```
benchDebug*10000: 24.003ms
benchBunyan*10000: 738.39ms
benchPino*10000: 717.07ms
benchDebugLevel*10000: 791.504ms
benchPinoAsync*10000: 521.031ms
benchDebugLevelAsync*10000: 573.552ms

```
