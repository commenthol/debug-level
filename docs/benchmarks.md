
### Basic String

`log.debug('hello world')`

```
benchDebug*10000: 18.546ms
benchBunyan*10000: 22.96ms
benchPino*10000: 9.484ms
benchDebugLevel*10000: 16.34ms
benchPinoAsync*10000: 6.189ms
benchDebugLevelAsync*10000: 9.902ms

```

### Long String 2000 chars

`log.debug('...2000chars...')`

```
benchDebug*10000: 57.241ms
benchBunyan*10000: 75.729ms
benchPino*10000: 65.504ms
benchDebugLevel*10000: 67.711ms
benchPinoAsync*10000: 56.107ms
benchDebugLevelAsync*10000: 59.471ms

```

### Hello World with %s format

`log.debug('hello %s', 'world')`

```
benchDebug*10000: 20.458ms
benchBunyan*10000: 24.222ms
benchPino*10000: 10.218ms
benchDebugLevel*10000: 17.011ms
benchPinoAsync*10000: 5.769ms
benchDebugLevelAsync*10000: 10.59ms

```

### Multi Argument format

`log.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })`

```
benchDebug*10000: 23.713ms
benchBunyan*10000: 38.137ms
benchPino*10000: 13.356ms
benchDebugLevel*10000: 25.32ms
benchPinoAsync*10000: 10.579ms
benchDebugLevelAsync*10000: 18.082ms

```

### Object

`log.debug({ msg: 'the message',string: 'string',number: 42,bool: true })`

```
benchDebug*10000: 38.19ms
benchBunyan*10000: 25.403ms
benchPino*10000: 15.406ms
benchDebugLevel*10000: 17.856ms
benchPinoAsync*10000: 8.526ms
benchDebugLevelAsync*10000: 14.703ms

```

### Deep Object

`log.debug(deep)`

```
benchDebug*10000: 1.046s
benchBunyan*10000: 269.327ms
benchPino*10000: 263.777ms
benchDebugLevel*10000: 278.875ms
benchPinoAsync*10000: 231.434ms
benchDebugLevelAsync*10000: 242.807ms

```

### Deep Object with %j format

`log.debug('deep %j', deep)`

```
benchDebug*10000: 20.346ms
benchBunyan*10000: 535.546ms
benchPino*10000: 526.309ms
benchDebugLevel*10000: 585.732ms
benchPinoAsync*10000: 492.425ms
benchDebugLevelAsync*10000: 555.237ms

```
