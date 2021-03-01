import { Wallet, providers, Contract, VoidSigner } from "ethers";

const wallet = Wallet.createRandom();
const avaURI = process.env.REACT_APP_AVALANCHE_URI || "https://api.avax-test.network/ext/bc/C/rpc";
export const ethereumProvider = new providers.InfuraProvider("goerli");
export const avaProvider = new providers.JsonRpcProvider(avaURI);
const avaSigner = new Wallet(wallet.privateKey, avaProvider);
export const avaVoidSigner = new VoidSigner(wallet.address, avaProvider);
export const goerliVoidsigner = new VoidSigner(wallet.address, ethereumProvider);
