import { Wallet, providers, Contract, VoidSigner } from "ethers";
import { SNT_ADDRESS as SNT_ETHEREUM } from "../constants/goerliAddress";
import { SNT_ADDRESS as SNT_AVALANCHE } from "../constants/fuji";
import { ERC20 } from "../types/ERC20";
import { Bridge as IBridge } from "../types/Bridge";
import { Bridge__factory } from "../types/factories/Bridge__factory";
import { ERC20__factory } from "../types/factories/ERC20__factory";
import { Provider } from '@ethersproject/providers';

export const getSNTEthereum = (provider: Provider) => getSNTContract(provider, SNT_ETHEREUM);
export const getSNTAvalanche = (provider: Provider) => getSNTContract(provider, SNT_AVALANCHE);
export const getSNTContract = (provider: Provider, address: string) => {
  return ERC20__factory.connect(address, provider);
}

export const getBridge = (address: string, provider: Provider) => {
  return Bridge__factory.connect(address, provider);
}

export const getSetBalance = async (token: ERC20|undefined, account: string, setState: Function) => {
  const balance = await token?.balanceOf(account);
  setState(balance);
}
