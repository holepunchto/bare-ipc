# bare-ipc

Lightweight pipe-based IPC for Bare. Built on top of `bare-pipe` (<https://github.com/holepunchto/bare-pipe>), it exposes a duplex stream over a pair of file handles whose ports can be transferred between Bare threads and processes.

```
npm i bare-ipc
```

## Usage

```js
const IPC = require('bare-ipc')

const [portA, portB] = IPC.open()

const a = portA.connect()
const b = portB.connect()

a.on('data', (data) => {
  // Handle data received from b
}).end('hello b')

b.on('data', (data) => {
  // Handle data received from a
}).end('hello a')
```

## API

See the [`bare-ipc` reference](https://docs.pears.com/reference/bare/modules/bare-ipc).

## License

Apache-2.0
