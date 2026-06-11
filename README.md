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

### `IPC`

#### `const [portA, portB] = IPC.open()`

Returns a pair of connected `IPCPort`s for constructing the IPC duplex stream based on `bare-pipe`. Each port is transferable and can be sent to another thread or process before being connected.

#### `const ipc = new IPC(port)`

Returns a duplex stream using the provided `port`. See `bare-stream`'s `Duplex` (<https://github.com/holepunchto/bare-stream>) for the duplex stream API.

Errors emitted by the underlying incoming or outgoing pipes are propagated to the stream as `error` events, after which the stream is destroyed.

#### `ipc.incoming`

The underlying `bare-pipe` `Pipe` used for reading. Read-only.

#### `ipc.outgoing`

The underlying `bare-pipe` `Pipe` used for writing. Read-only.

#### `ipc.ref()`

Increase the reference count for the IPC to keep the event loop alive.

A common pattern is to `ipc.ref()` on `Bare.on('resume')` and `ipc.unref()` on suspend like so:

```js
Bare.on('suspend', () => ipc.unref()).on('resume', () => ipc.ref())
```

#### `ipc.unref()`

Decrease the reference count for the IPC to allow the event loop to exit.

See `ipc.ref()` for the common pattern to keep the event loop alive.

### `IPCPort`

#### `const port = new IPCPort(incoming, outgoing)`

Constructs a port from a pair of file handles. The arguments are:

- `incoming` is the read file handle.
- `outgoing` is the write file handle.

#### `port.connect()`

Returns an `IPC` connected to the `port` and marks the `port` as detached.

#### `port.incoming`

The read file handle. Read-only.

#### `port.outgoing`

The write file handle. Read-only.

#### `port.detached`

A boolean for whether the `port` is detached. A port becomes detached once it is connected or transferred, and a detached port cannot be transferred again.

## License

Apache-2.0
