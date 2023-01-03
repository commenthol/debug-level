/**
 * @credits quick-format-unescaped
 * @license The MIT License (MIT)
 * @copyright Copyright (c) 2016-2019 David Mark Clements
 */

import assert from 'assert'
import { format } from '../src/quick-format.js'

describe('quick-format', function () {
  it('empty object', function () {
    const emptyObj = {}
    assert.strictEqual(format(emptyObj, []), '')
    assert.strictEqual(format(emptyObj, ['a', 'b', 'c']), ' a b c')
    assert.strictEqual(format('', ['a']), ' a')
  })
  it('symbols', function () {
    // ES6 Symbol handling
    const symbol = Symbol('foo')
    assert.strictEqual(format(null, [symbol]), 'null Symbol(foo)')
    assert.strictEqual(format('foo', [symbol]), 'foo Symbol(foo)')
    assert.strictEqual(format('%s', [symbol]), 'Symbol(foo)')
    assert.strictEqual(format('%j', [symbol]), 'undefined')
    assert.throws(function () {
      format('%d', [symbol])
    }, TypeError)
  })
  it('numbers', function () {
    assert.strictEqual(format('%d', [42.0]), '42')
    assert.strictEqual(format('%f', [42.99]), '42.99')
    assert.strictEqual(format('%i', [42.99]), '42')
    assert.strictEqual(format('%d', [42]), '42')
    assert.strictEqual(format('%s', [42]), '42')
    assert.strictEqual(format('%j', [42]), '42')
  })
  it('undefined', function () {
    assert.strictEqual(format('%d', [undefined]), '%d')
    assert.strictEqual(format('%s', [undefined]), 'undefined')
    assert.strictEqual(format('%j', [undefined]), '%j')
  })
  it('null', function () {
    assert.strictEqual(format('%d', [null]), '%d')
    assert.strictEqual(format('%s', [null]), 'null')
    assert.strictEqual(format('%j', [null]), 'null')
  })
  it('strings', function () {
    assert.strictEqual(format('%d', ['42.0']), '42')
    assert.strictEqual(format('%d', ['42']), '42')
    assert.strictEqual(format('%d %d', ['42']), '42 %d')
    assert.strictEqual(format('foo %d', ['42']), 'foo 42')
    assert.strictEqual(format('%s', ['42']), '42')
    assert.strictEqual(format('%j', ['42']), "'42'")
    assert.strictEqual(format('%%s%s', ['foo']), '%sfoo')
  })
  it('mixed', function () {
    assert.strictEqual(format('%s', []), '%s')
    assert.strictEqual(format('%s', [undefined]), 'undefined')
    assert.strictEqual(format('%s', ['foo']), 'foo')
    assert.strictEqual(format('%s', ['"quoted"']), '"quoted"')
    assert.strictEqual(format('%j', [{ s: '"quoted"' }]), '{"s":"\\"quoted\\""}')
    assert.strictEqual(format('%s:%s', []), '%s:%s')
    assert.strictEqual(format('%s:%s', [undefined]), 'undefined:%s')
    assert.strictEqual(format('%s:%s', ['foo']), 'foo:%s')
    assert.strictEqual(format('%s:%s', ['foo', 'bar']), 'foo:bar')
    assert.strictEqual(format('%s:%s', ['foo', 'bar', 'baz']), 'foo:bar baz')
    assert.strictEqual(format('%s%s', []), '%s%s')
    assert.strictEqual(format('%s%s', [undefined]), 'undefined%s')
    assert.strictEqual(format('%s%s', ['foo']), 'foo%s')
    assert.strictEqual(format('%s%s', ['foo', 'bar']), 'foobar')
    assert.strictEqual(format('%s%s', ['foo', 'bar', 'baz']), 'foobar baz')
    assert.strictEqual(format('foo %s', ['foo']), 'foo foo')
  })
  it('objects', function () {
    assert.strictEqual(format('foo %o', [{ foo: 'foo' }]), 'foo {"foo":"foo"}')
    assert.strictEqual(format('foo %O', [{ foo: 'foo' }]), 'foo {"foo":"foo"}')
    assert.strictEqual(format('foo %j', [{ foo: 'foo' }]), 'foo {"foo":"foo"}')
    assert.strictEqual(format('foo %j %j', [{ foo: 'foo' }]), 'foo {"foo":"foo"} %j')
    assert.strictEqual(format('foo %j', ['foo']), 'foo \'foo\'') // TODO: isn't this wrong?
    assert.strictEqual(format('foo %j', [function foo () {}]), 'foo foo()')
    assert.strictEqual(format('foo %j', [function () {}]), 'foo <anonymous>()')
    assert.strictEqual(format('foo %j', [{ foo: 'foo' }, 'not-printed']), 'foo {"foo":"foo"} not-printed')
    assert.strictEqual(
      format('foo %j', [{ foo: 'foo' }], { stringify () { return 'REPLACED' } }),
      'foo REPLACED'
    )
    const circularObject = {}
    circularObject.foo = circularObject
    assert.strictEqual(format('foo %j', [circularObject]), 'foo "[Circular]"')
  })
  it('percent escaping', function () {
    assert.strictEqual(format('%%', ['foo']), '% foo')
    assert.strictEqual(format('foo %%', ['foo']), 'foo % foo')
    assert.strictEqual(format('foo %% %O', [{ bar: 1 }]), 'foo % {"bar":1}')
    assert.strictEqual(format('%%%s%%', ['hi']), '%hi%')
    assert.strictEqual(format('%%%s%%%%', ['hi']), '%hi%%')
  })
  it('functions', function () {
    function test () {}

    assert.strictEqual(format(test, []), 'test()')
    assert.strictEqual(format('%s', [test]), 'function test () {}')
    assert.strictEqual(format('%s', ['hi', test]), 'hi test()')

    assert.strictEqual(format(() => {}, []), '<anonymous>()')
    assert.strictEqual(format('%s', [() => {}]), '() => {}')
    assert.strictEqual(format('%s', ['hi', () => {}]), 'hi <anonymous>()')
  })
  it('object assignment', function () {
    const obj = {}
    assert.strictEqual(format('%s%%%s', ['foo', 'bar', { hello: 'object' }, { test: 1 }], {}, obj), 'foo%bar')
    assert.deepStrictEqual(obj, { hello: 'object', test: 1 })
  })
  it('no formatter', function () {
    const obj = {}
    assert.strictEqual(format({ hello: 'object' }, ['foo', 'bar', { test: 1 }], {}, obj), ' foo bar')
    assert.deepStrictEqual(obj, { hello: 'object', test: 1 })
  })
  it('error', function () {
    const obj = {}
    const err = new Error('boom')
    err.code = 418
    assert.strictEqual(format(err, [], {}, obj), 'boom')
    assert.deepStrictEqual(obj, { err })
  })
  it('message and error', function () {
    const obj = {}
    const err = new Error('boom')
    err.code = 418
    assert.strictEqual(format('an error', [err], {}, obj), 'an error')
    assert.deepStrictEqual(obj, { err })
  })
})
