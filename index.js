const Pipe = require('bare-pipe')
const { Duplex } = require('bare-stream')
const errors = require('./lib/errors')

const IPC = module.exports = exports = class IPC extends Duplex {
  constructor (port) {
    const {
      incoming,
      outgoing
    } = port

    super()

    this._incoming = new Pipe(incoming)
    this._outgoing = new Pipe(outgoing)

    this._pendingWrite = null

    this._incoming
      .on('data', this._ondata.bind(this))
      .on('end', this._onend.bind(this))

    this._outgoing
      .on('drain', this._ondrain.bind(this))
  }

  _write (chunk, encoding, cb) {
    if (this._outgoing.write(chunk)) cb(null)
    else this._pendingWrite = cb
  }

  _final (cb) {
    this._outgoing.end()
    cb(null)
  }

  _ondata (data) {
    this.push(data)
  }

  _onend () {
    this.push(null)
  }

  _ondrain () {
    if (this._pendingWrite === null) return
    const cb = this._pendingWrite
    this._pendingWrite = null
    cb(null)
  }
}

class IPCPort {
  constructor (incoming, outgoing) {
    this.incoming = incoming
    this.outgoing = outgoing
    this.detached = false
  }

  connect () {
    const ipc = new IPC(this)
    this.detached = true
    return ipc
  }

  [Symbol.for('bare.detach')] () {
    if (this.detached) {
      throw errors.ALREADY_CONNECTED('Port has already started receiving messages')
    }

    this.detached = true

    return [this.incoming, this.outgoing]
  }

  static [Symbol.for('bare.attach')] ([incoming, outgoing]) {
    return new this(incoming, outgoing)
  }
}

exports.open = function open (opts) {
  const a = Pipe.pipe(opts)
  const b = Pipe.pipe(opts)

  return [
    new IPCPort(a[0], b[1], opts),
    new IPCPort(b[0], a[1], opts)
  ]
}
