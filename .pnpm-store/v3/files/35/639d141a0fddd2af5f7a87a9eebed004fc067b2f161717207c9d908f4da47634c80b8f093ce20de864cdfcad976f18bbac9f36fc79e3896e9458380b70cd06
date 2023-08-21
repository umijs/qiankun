const test = require('brittle')
const cyclist = require('./')

test('basic put and get', function (t) {
  const list = cyclist(2)
  list.put(0, 'hello')
  list.put(1, 'world')
  t.is(list.get(0), 'hello')
  t.is(list.get(1), 'world')
  t.end()
})

test('overflow put and get', function (t) {
  const list = cyclist(2)
  list.put(0, 'hello')
  list.put(1, 'world')
  list.put(2, 'verden')
  t.is(list.get(0), 'verden')
  t.is(list.get(1), 'world')
  t.is(list.get(2), 'verden')
  t.end()
})

test('del', function (t) {
  const list = cyclist(2)
  list.put(0, 'hello')
  t.is(list.get(0), 'hello')
  list.del(0)
  t.ok(!list.get(0))
  t.end()
})

test('multiple of two', function (t) {
  const list = cyclist(3)
  t.is(list.size, 4)
  t.end()
})
