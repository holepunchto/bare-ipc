module.exports = class IPCError extends Error {
  constructor (msg, code, fn = IPCError) {
    super(`${code}: ${msg}`)
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, fn)
    }
  }

  get name () {
    return 'IPCError'
  }

  static ALREADY_CONNECTED (msg) {
    return new IPCError(msg, 'ALREADY_CONNECTED', IPCError.ALREADY_CONNECTED)
  }
}
