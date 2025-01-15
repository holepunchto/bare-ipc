import { Duplex } from 'bare-stream'

declare class IPC extends Duplex {
  constructor(port: IPCPort)
}

declare interface IPCPort {
  incoming: string | number
  outgoing: string | number
  detached: boolean

  connect(): IPC
}

declare class IPCPort {
  constructor(incoming: string | number, outgoing: string | number)
}

declare namespace IPC {
  export function open(): [IPCPort, IPCPort]
}

export = IPC
