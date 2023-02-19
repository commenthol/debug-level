import assert from 'assert'
import { Format } from '../src/Format.js'
import fixtures from './fixtures/Format.js'
import { testcases } from './fixtures/testcases.js'
import { ua } from './helpers/ua.js'

const inspect = (o) => console.log('%j', o)

const WRITE = false

describe('#Format', function () {
  describe('format', function () {
    const fixture = fixtures.format
    const format = new Format()
    const exp = []

    after(() => {
      if (WRITE) inspect(exp)
    })

    testcases.forEach(({ name, args }, idx) => {
      it(idx + ' ' + name, function () {
        if (ua === 'firefox' && [22, 23].includes(idx)) return
        const [fmt, ...fmtArgs] = args
        const res = format.format(fmt, fmtArgs)
        if (WRITE) exp.push(res)
        assert.deepStrictEqual(res, fixture[idx])
      })
    })

    it('should set spaces option', function () {
      format.spaces = 2
      assert.deepStrictEqual(
        format.format('%j', [{ a: { b: { c: 'd' } } }]),
        '{\n  "a": {\n    "b": {\n      "c": "d"\n    }\n  }\n}'
      )
    })

    it('should get spaces option', function () {
      assert.strictEqual(format.spaces, 2)
    })

    it('should expose stringify', function () {
      const res = format.stringify({ test: 1 })
      assert.strictEqual(res, '{"test":1}')
    })
  })
})
