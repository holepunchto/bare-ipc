const test = require('brittle')
const IPC = require('.')

test('basic', (t) => {
  t.plan(4)

  const ports = IPC.open()

  const a = ports[0].connect()
  const b = ports[1].connect()

  a.on('close', () => t.pass('a closed'))
    .on('data', (data) => t.alike(data, Buffer.from('hello a')))
    .end('hello b')

  b.on('close', () => t.pass('b closed'))
    .on('data', (data) => t.alike(data, Buffer.from('hello b')))
    .end('hello a')
})

test('large write', (t) => {
  t.plan(3)

  const ports = IPC.open()

  const a = ports[0].connect()
  const b = ports[1].connect()

  const received = []

  a.on('close', () => {
    t.pass('a closed')
    t.alike(Buffer.concat(received), Buffer.alloc(4 * 1024 * 1024, 'hello a'))
  })
    .on('data', (data) => received.push(data))
    .end()

  b.on('close', () => t.pass('b closed'))
    .on('data', (data) => received.push(data))
    .end(Buffer.alloc(4 * 1024 * 1024, 'hello a'))
})
