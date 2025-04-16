# bare-ipc

Lightweight pipe-based IPC for Bare.

```
npm i bare-ipc
```

## API

### `IPC`

#### `const [portA, portB] = IPC.open(opts)`

Returns a pair of `IPCPort`s for use constructing the IPC duplex stream based on
`bare-pipe`.

#### `const ipc = new IPC(port)`

Returns a duplex stream using the provided port. See `streamx`'s [`Duplex`](https://github.com/mafintosh/streamx?tab=readme-ov-file#duplex-stream) for Duplex API.

#### `ipc.ref()`

Increase the reference count for the IPC to keep the event loop alive.

A common pattern is to `ipc.ref()` on `Bare.on('resume')` and `ipc.unref()` on
suspend like so:

```js
Bare.on('suspend', () => ipc.unref()).on('resume', () => ipc.ref())
```

#### `ipc.unref()`

Decrease the reference count for the IPC to allow the event loop to exit.

See [`ipc.ref()`](#ipcref) for common pattern to keep the event loop alive.

### `IPCPort`

#### `const port = new IPCPort(incoming, outgoing)`

The arguments are:

- `incoming` is the read file handle
- `outgoing` is the write file handle

#### `port.connect()`

Returns an `IPC` connected to the `port`.

#### `port.detached`

A boolean for whether the `port` is detached.

## License

Apache-2.0
