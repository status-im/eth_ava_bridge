import { Wallet, providers, Contract, VoidSigner } from "ethers";

const wallet = Wallet.createRandom();
export const goerliProvider = new providers.InfuraProvider("goerli");
export const fujiProvider = new providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
const fujiSigner = new Wallet(wallet.privateKey, fujiProvider);
export const fujiVoidSigner = new VoidSigner(wallet.address, fujiProvider);
export const goerliVoidsigner = new VoidSigner(wallet.address, goerliProvider);
