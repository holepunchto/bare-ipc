const test = require('brittle')
const IPC = require('.')

test('basic', (t) => {
  t.plan(2)

  const ports = IPC.open()

  const a = ports[0].connect()
  const b = ports[1].connect()

  a.on('data', (data) => t.alike(data, Buffer.from('hello a')))
  b.on('data', (data) => t.alike(data, Buffer.from('hello b')))

  a.end('hello b')
  b.end('hello a')
})
