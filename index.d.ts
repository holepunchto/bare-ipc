import { Duplex } from 'bare-stream'
import { Transferable, symbols } from 'bare-structured-clone'

declare class IPC extends Duplex {
  constructor(port: IPCPort)
}

declare interface IPCPort {
  readonly incoming: number
  readonly outgoing: number
  readonly detached: boolean

  connect(): IPC

  [symbols.detach](): [incoming: number, outgoing: number]
}

declare class IPCPort implements Transferable {
  constructor(incoming: number, outgoing: number)

  static [symbols.attach](input: [incoming: number, outgoing: number]): IPCPort
}

declare namespace IPC {
  export function open(): [IPCPort, IPCPort]
}

export = IPC
