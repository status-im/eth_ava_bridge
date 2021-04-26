import { Bridge as IBridge } from "../types/Bridge";
import { ERC20Handler } from "../types/ERC20Handler";
import { getERC20Handler } from "./contracts";
import { Event, BigNumber } from "ethers";
import { ETHEREUM_CHAIN_ID } from "../constants/networks";
import { generateDepositDataHash, createERCDepositData } from "./helpers"
import { avalancheSNTHandlerAddress } from "../constants/bridges"

enum ProposalStatus {
  Inactive,
  Active,
  Passed,
  Executed,
  Cancelled
}

type Proposal = {
  status: ProposalStatus,
  yesVotesTotal: number,
  statusName: string
}

type DecodedDeposit = {
  depositNonce: BigNumber,
  destinationChainID: number,
  resourceID: string
}
type DepositRecord = {
  _amount: BigNumber,
  _depositer: string,
  _destinationRecipientAddress: string,
  _tokenAddress: string
}
export interface EnrichedDepositEvent extends Event {
  decoded?: DecodedDeposit,
  depositRecord?: DepositRecord,
  proposal?: Proposal
}

export const getDepositEvents = async (
  ethereumBridge: IBridge|undefined,
  avalancheBridge: IBridge|undefined,
  setState: Function
) => {
  if(!ethereumBridge) return
  const events = ethereumBridge.filters.Deposit(null,null,null)
  const deposits: Event[] = await ethereumBridge.queryFilter(events)
  const enriched = deposits.map(async d => {
    const { data, topics, decode } = d
    if (!decode) return
    const decoded: DecodedDeposit = decode(data, topics)
    const newD: EnrichedDepositEvent = d
    newD.decoded = decoded
    const handlerAddress = await ethereumBridge._resourceIDToHandlerAddress(decoded.resourceID)
    const erc20Handler: ERC20Handler = getERC20Handler(handlerAddress, ethereumBridge.provider);
    const depositRecord = await erc20Handler._depositRecords(decoded.destinationChainID, decoded.depositNonce);
    newD.depositRecord = depositRecord;
    const { _amount, _destinationRecipientAddress } = depositRecord;
    const encodedMetaData = createERCDepositData(_amount, _destinationRecipientAddress)
    const hash = generateDepositDataHash(avalancheSNTHandlerAddress, encodedMetaData)
    const proposal = await avalancheBridge?.getProposal(ETHEREUM_CHAIN_ID, decoded.depositNonce, hash)
    let statusNum = proposal?._status
    if (!statusNum) statusNum = 0;
    const proposalStatus: string = ProposalStatus[statusNum]
    newD.proposal = {
      status: statusNum,
      yesVotesTotal: proposal?._yesVotesTotal ? proposal._yesVotesTotal : 0,
      statusName: proposalStatus
    }
    return newD
  })
  const resolved = await Promise.all(enriched)
  setState(resolved)
}
