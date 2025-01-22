declare class IPCError extends Error {
  static ALREADY_CONNECTED(msg: string): IPCError
}

export = IPCError
