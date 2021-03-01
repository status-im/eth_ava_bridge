import { Bridge as IBridge } from "../types/Bridge";
import { ERC20Handler } from "../types/ERC20Handler";
import { getERC20Handler } from "./contracts";
import { Event } from "ethers";

export interface EnrichedEvent extends Event {
  decoded?: Array<any>,
  depositRecord?: object
}

export const getDepositEvents = async (ethereumBridge: IBridge|undefined, setState: Function) => {
  if(!ethereumBridge) return
  const events = ethereumBridge.filters.Deposit(null,null,null)
  const deposits: Event[] = await ethereumBridge.queryFilter(events)
  const enriched = deposits.map(async d => {
    const { data, topics, decode } = d
    if (!decode) return
    const decoded = decode(data, topics)
    const newD: EnrichedEvent = d
    newD.decoded = decoded
    const handlerAddress = await ethereumBridge._resourceIDToHandlerAddress(decoded.resourceID)
    const erc20Handler: ERC20Handler = getERC20Handler(handlerAddress, ethereumBridge.provider);
    const depositRecord = await erc20Handler._depositRecords(decoded.destinationChainID, decoded.depositNonce);
    newD.depositRecord = depositRecord;
    return newD
  })
  const resolved = await Promise.all(enriched)
  setState(resolved)
}
