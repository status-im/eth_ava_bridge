import { providers } from "ethers";
import { Network } from "@ethersproject/networks";
import { Provider } from "@ethersproject/providers"

const networksMap: Record<number, string> = {
  5: 'goerli',
  43113: 'fuji'
}

export async function getAndSetProvider(setProvider: Function) {
  await window.ethereum.enable();
  const provider = new providers.Web3Provider(window.ethereum);
  setProvider(provider);
}

export async function getNetwork(p: Provider, setNetwork: Function) {
  const res: Network = await p.getNetwork();
  setNetwork(networksMap[res.chainId]);
}
