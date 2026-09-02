import { Duplex } from 'bare-stream'
import Pipe from 'bare-pipe'
import { Transferable, symbols } from 'bare-structured-clone'

interface IPC extends Duplex {
  /** The underlying `bare-pipe` `Pipe` used for reading. Read-only. */
  readonly incoming: Pipe
  /** The underlying `bare-pipe` `Pipe` used for writing. Read-only. */
  readonly outgoing: Pipe

  /** Increase the reference count for the IPC to keep the event loop alive. */
  ref(): this
  /** Decrease the reference count for the IPC to allow the event loop to exit. */
  unref(): this
}

declare class IPC {
  /**
   * Returns a duplex stream using the provided `port`. See `bare-stream`'s `Duplex`
   * (<https://github.com/holepunchto/bare-stream>) for the duplex stream API.
   * @param port - The port to open the stream over, as returned by `IPC.open()`.
   */
  constructor(port: IPCPort)
}

interface IPCPort extends Transferable<[incoming: number, outgoing: number]> {
  /** The file handle used for reading. Read-only. */
  readonly incoming: number
  /** The file handle used for writing. Read-only. */
  readonly outgoing: number
  /**
   * A boolean for whether the `port` is detached. A port becomes detached once it is connected or
   * transferred, and a detached port cannot be transferred again.
   */
  readonly detached: boolean

  /**
   * @returns An `IPC` duplex stream connected to the port.
   */
  connect(): IPC
}

declare class IPCPort {
  /**
   * Constructs a port from a pair of file handles, `incoming` and `outgoing`.
   * @param incoming - The file handle used for reading.
   * @param outgoing - The file handle used for writing.
   */
  constructor(incoming: number, outgoing: number)

  static [symbols.attach](input: [incoming: number, outgoing: number]): IPCPort
}

declare namespace IPC {
  export { IPCPort }

  /**
   * Returns a pair of connected `IPCPort`s for constructing the IPC duplex stream based on
   * `bare-pipe`. Each port is transferable and can be sent to another thread or process before
   * being connected.
   * @returns A pair of connected ports, one for each end of the IPC channel.
   */
  export function open(): [IPCPort, IPCPort]
}

export = IPC
