import { Bridge as IBridge } from "../types/Bridge";
import { Event } from "ethers";

export interface EnrichedEvent extends Event {
  decoded?: Array<any>
}

export const getDepositEvents = async (ethereumBridge: IBridge|undefined, setState: Function) => {
  if(!ethereumBridge) return
  const events = ethereumBridge.filters.Deposit(null,null,null)
  const deposits: Event[] = await ethereumBridge.queryFilter(events)
  const enriched = deposits.map(d => {
    const { data, topics, decode } = d
    if (!decode) return
    const decoded = decode(data, topics)
    const newD: EnrichedEvent = d
    newD.decoded = decoded
    return newD
  })
  setState(enriched)
}
