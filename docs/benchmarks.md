
### Basic String

`log.debug('hello world')`

```
benchDebug*10000: 17.8ms
benchBunyan*10000: 17.515ms
benchPino*10000: 8.17ms
benchDebugLevel*10000: 12.267ms
benchPinoAsync*10000: 5.024ms
benchDebugLevelAsync*10000: 8.451ms

```

### Long String 2000 chars

`log.debug('...2000chars...')`

```
benchDebug*10000: 45.957ms
benchBunyan*10000: 97.647ms
benchPino*10000: 51.415ms
benchDebugLevel*10000: 54.878ms
benchPinoAsync*10000: 48.239ms
benchDebugLevelAsync*10000: 51.354ms

```

### Hello World with %s format

`log.debug('hello %s', 'world')`

```
benchDebug*10000: 18.493ms
benchBunyan*10000: 17.792ms
benchPino*10000: 8.904ms
benchDebugLevel*10000: 11.936ms
benchPinoAsync*10000: 5.433ms
benchDebugLevelAsync*10000: 8.517ms

```

### Multi Argument format

`log.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })`

```
benchDebug*10000: 21.025ms
benchBunyan*10000: 28.253ms
benchPino*10000: 12.756ms
benchDebugLevel*10000: 17.192ms
benchPinoAsync*10000: 8.299ms
benchDebugLevelAsync*10000: 14.229ms

```

### Object

`log.debug({ msg: 'the message',string: 'string',number: 42,bool: true })`

```
benchDebug*10000: 32.102ms
benchBunyan*10000: 20.549ms
benchPino*10000: 12.794ms
benchDebugLevel*10000: 14.221ms
benchPinoAsync*10000: 7.362ms
benchDebugLevelAsync*10000: 11.94ms

```

### Deep Object

`log.debug(deep)`

```
benchDebug*10000: 789.847ms
benchBunyan*10000: 189.849ms
benchPino*10000: 175.877ms
benchDebugLevel*10000: 186.95ms
benchPinoAsync*10000: 167.965ms
benchDebugLevelAsync*10000: 178.79ms

```

### Deep Object with %j format

`log.debug('deep %j', deep)`

```
benchDebug*10000: 19.26ms
benchBunyan*10000: 666.29ms
benchPino*10000: 422.59ms
benchDebugLevel*10000: 469.566ms
benchPinoAsync*10000: 407.956ms
benchDebugLevelAsync*10000: 458.122ms

```
