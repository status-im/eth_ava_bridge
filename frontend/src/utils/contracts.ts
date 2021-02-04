import { Wallet, providers, Contract, VoidSigner } from "ethers";
import { SNT_ADDRESS } from "../constants/goerliAddress";
import { ERC20 } from "../types/ERC20";
import { ERC20__factory } from "../types/factories/ERC20__factory"
import { Provider } from '@ethersproject/providers'

export const getISntEthereum = (provider: Provider) => {
  return ERC20__factory.connect(SNT_ADDRESS, provider);
}

export const getSetBalance = async (token: ERC20|undefined, account: string, setState: Function) => {
  const balance = await token?.balanceOf(account);
  setState(balance);
}
