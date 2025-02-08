const { spawnSync } = require('child_process')
const { join } = require('path')

const files = [
  {
    file: 'basic.bench.js',
    name: 'Basic String',
    fmt: "log.debug('hello world')"
  },
  {
    file: 'long-string.bench.js',
    name: 'Long String 2000 chars',
    fmt: "log.debug('...2000chars...')"
  },
  {
    file: 'format-s.bench.js',
    name: 'Hello World with %s format',
    fmt: "log.debug('hello %s', 'world')"
  },
  {
    file: 'format-sjd.bench.js',
    name: 'Multi Argument format',
    fmt: "log.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })"
  },
  {
    file: 'obj.bench.js',
    name: 'Object',
    fmt: "log.debug({ msg: 'the message',string: 'string',number: 42,bool: true })"
  },
  { file: 'deep.bench.js', name: 'Deep Object', fmt: 'log.debug(deep)' },
  {
    file: 'deep-j.bench.js',
    name: 'Deep Object with %j format',
    fmt: "log.debug('deep %j', deep)"
  }
]

files.forEach(({ file, name, fmt }) => {
  let { stdout, stderr } = spawnSync(process.argv[0], [join(__dirname, file)])

  if (stderr.length) {
    stdout = stderr
  }

  console.log(`
### ${name}

\`${fmt}\`

\`\`\`
${stdout}
\`\`\``)
})
