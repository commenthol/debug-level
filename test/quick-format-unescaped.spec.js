/**
 * @credits quick-format-unescaped
 * @license The MIT License (MIT)
 * @copyright Copyright (c) 2016-2019 David Mark Clements
 */

const assert = require('assert')
const format = require('../src/quick-format-unescaped.js')

describe('quick-format-unescaped', function () {
  it('tests', function () {
    // assert.strictEqual(format([]), '')
    // assert.strictEqual(format(['']), '')
    // assert.strictEqual(format([[]]), '[]')
    // assert.strictEqual(format([{}]), '{}')
    // assert.strictEqual(format([null]), 'null')
    // assert.strictEqual(format([true]), 'true')
    // assert.strictEqual(format([false]), 'false')
    // assert.strictEqual(format(['test']), 'test')

    // // // CHECKME this is for console.log() compatibility - but is it *right*?
    // assert.strictEqual(format(['foo', 'bar', 'baz']), 'foo bar baz');

    const emptyObj = {}
    assert.strictEqual(format(emptyObj, []), emptyObj)
    assert.strictEqual(format(emptyObj, ['a', 'b', 'c']), '{} "b" "c" ')
    assert.strictEqual(format('', ['a']), '')

    // ES6 Symbol handling
    const symbol = Symbol('foo')
    assert.strictEqual(format(null, [symbol]), null)
    assert.strictEqual(format('foo', [symbol]), 'foo')
    assert.strictEqual(format('%s', [symbol]), 'Symbol(foo)')
    assert.strictEqual(format('%j', [symbol]), 'undefined')
    assert.throws(function () {
      format('%d', [symbol])
    }, TypeError)

    assert.strictEqual(format('%d', [42.0]), '42')
    assert.strictEqual(format('%f', [42.99]), '42.99')
    assert.strictEqual(format('%i', [42.99]), '42')
    assert.strictEqual(format('%d', [42]), '42')
    assert.strictEqual(format('%s', [42]), '42')
    assert.strictEqual(format('%j', [42]), '42')

    assert.strictEqual(format('%d', [undefined]), '%d')
    assert.strictEqual(format('%s', [undefined]), 'undefined')
    assert.strictEqual(format('%j', [undefined]), '%j')

    assert.strictEqual(format('%d', [null]), '%d')
    assert.strictEqual(format('%s', [null]), 'null')
    assert.strictEqual(format('%j', [null]), 'null')

    assert.strictEqual(format('%d', ['42.0']), '42')
    assert.strictEqual(format('%d', ['42']), '42')
    assert.strictEqual(format('%d %d', ['42']), '42 %d')
    assert.strictEqual(format('foo %d', ['42']), 'foo 42')
    assert.strictEqual(format('%s', ['42']), '42')
    // assert.strictEqual(format('%j', ['42']), '"42"');

    // assert.strictEqual(format('%%s%s', ['foo']), '%sfoo');

    assert.strictEqual(format('%s', []), '%s')
    assert.strictEqual(format('%s', [undefined]), 'undefined')
    assert.strictEqual(format('%s', ['foo']), 'foo')
    assert.strictEqual(format('%s', ['"quoted"']), '"quoted"')
    assert.strictEqual(format('%j', [{ s: '"quoted"' }]), '{"s":"\\"quoted\\""}')
    assert.strictEqual(format('%s:%s', []), '%s:%s')
    assert.strictEqual(format('%s:%s', [undefined]), 'undefined:%s')
    assert.strictEqual(format('%s:%s', ['foo']), 'foo:%s')
    assert.strictEqual(format('%s:%s', ['foo', 'bar']), 'foo:bar')
    assert.strictEqual(format('%s:%s', ['foo', 'bar', 'baz']), 'foo:bar')
    assert.strictEqual(format('%s%s', []), '%s%s')
    assert.strictEqual(format('%s%s', [undefined]), 'undefined%s')
    assert.strictEqual(format('%s%s', ['foo']), 'foo%s')
    assert.strictEqual(format('%s%s', ['foo', 'bar']), 'foobar')
    assert.strictEqual(format('%s%s', ['foo', 'bar', 'baz']), 'foobar')

    assert.strictEqual(format('foo %s', ['foo']), 'foo foo')

    assert.strictEqual(format('foo %o', [{ foo: 'foo' }]), 'foo {"foo":"foo"}')
    assert.strictEqual(format('foo %O', [{ foo: 'foo' }]), 'foo {"foo":"foo"}')
    assert.strictEqual(format('foo %j', [{ foo: 'foo' }]), 'foo {"foo":"foo"}')
    assert.strictEqual(format('foo %j %j', [{ foo: 'foo' }]), 'foo {"foo":"foo"} %j')
    assert.strictEqual(format('foo %j', ['foo']), 'foo \'foo\'') // TODO: isn't this wrong?
    assert.strictEqual(format('foo %j', [function foo () {}]), 'foo foo')
    assert.strictEqual(format('foo %j', [function () {}]), 'foo <anonymous>')
    assert.strictEqual(format('foo %j', [{ foo: 'foo' }, 'not-printed']), 'foo {"foo":"foo"}')
    assert.strictEqual(
      format('foo %j', [{ foo: 'foo' }], { stringify () { return 'REPLACED' } }),
      'foo REPLACED'
    )
    const circularObject = {}
    circularObject.foo = circularObject
    assert.strictEqual(format('foo %j', [circularObject]), 'foo "[Circular]"')

    // // assert.strictEqual(format(['%%%s%%', 'hi']), '%hi%');
    // // assert.strictEqual(format(['%%%s%%%%', 'hi']), '%hi%%');

    // (function() {
    //   var o = {};
    //   o.o = o;
    //   assert.strictEqual(format(['%j', o]), '[Circular]');
    // })();

    assert.strictEqual(format('%%', ['foo']), '%')
    assert.strictEqual(format('foo %%', ['foo']), 'foo %')
    assert.strictEqual(format('foo %% %O', [{ bar: 1 }]), 'foo % {"bar":1}')
  })
})
