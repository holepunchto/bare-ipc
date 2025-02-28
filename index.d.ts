import { Duplex } from 'bare-stream'
import { Transferable, symbols } from 'bare-structured-clone'

interface IPC extends Duplex {
  ref(): this
  unref(): this
}

declare class IPC {
  constructor(port: IPCPort)
}

interface IPCPort extends Transferable<[incoming: number, outgoing: number]> {
  readonly incoming: number
  readonly outgoing: number
  readonly detached: boolean

  connect(): IPC
}

declare class IPCPort {
  constructor(incoming: number, outgoing: number)

  static [symbols.attach](input: [incoming: number, outgoing: number]): IPCPort
}

declare namespace IPC {
  export { IPCPort }

  export function open(): [IPCPort, IPCPort]
}

export = IPC
