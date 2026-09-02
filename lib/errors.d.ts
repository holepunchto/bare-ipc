declare class IPCError extends Error {
  /**
   * Create the error thrown when transferring a port that has already been connected or
   * transferred.
   * @param msg - The error message.
   * @returns An error with code `ALREADY_CONNECTED`.
   */
  static ALREADY_CONNECTED(msg: string): IPCError
}

export = IPCError
