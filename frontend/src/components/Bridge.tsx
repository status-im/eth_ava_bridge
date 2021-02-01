import React, { useContext, useEffect, useState } from 'react';
import { BridgeContext, SymfoniBridge } from "./../hardhat/SymfoniContext";
import { Wallet, providers, Contract, VoidSigner } from "ethers";
import { Bridge as IBridge } from "../types/Bridge"
import { SNT_ETHEREUM } from "../constants/goerliAddress";

const wallet = Wallet.createRandom();

interface Props { }
const FUJI_BRIDGE = '0xE57Eb49689bCAE4dE61D326F7E79Bd14aB527f0f';
const GOERLI_BRIDGE = '0xD0E461b1Dc56503fC72565FA964C28E274146D44';
const fujiProvider = new providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
const goerliProvider = new providers.InfuraProvider("goerli");
const fujiSigner = new Wallet(wallet.privateKey, fujiProvider);
const fujiVoidSigner = new VoidSigner(wallet.address, fujiProvider);
const goerliVoidsigner = new VoidSigner(wallet.address, goerliProvider);


export const Bridge: React.FC<Props> = () => {
  const bridge: SymfoniBridge = useContext(BridgeContext);
  /* fujiBridge.factory?.connect(fujiSigner);
   * fujiBridge.factory?.attach(FUJI_BRIDGE); */
  const [message, setMessage] = useState("");
  const [inputGreeting, setInputGreeting] = useState("");
  const [goerliBridge, setGoerliBridge] = useState<IBridge>();
  const [fujiBridge, setFujiBridge] = useState<IBridge>();
  useEffect(() => {
    const doAsync = async () => {
      if (!bridge.instance) return
      console.log("Bridge is deployed at ", bridge.instance.address)
      let gBridge = new Contract(
        GOERLI_BRIDGE,
        bridge.instance.interface,
        goerliVoidsigner
      ) as IBridge;
      setGoerliBridge(gBridge);
      let fBridge = new Contract(
        FUJI_BRIDGE,
        bridge.instance.interface,
        fujiVoidSigner
      ) as IBridge;
      setFujiBridge(fBridge);
    };
    doAsync();
  }, [bridge])

  const handleSetGreeting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!bridge.instance) throw Error("Bridge instance not ready")
    if (bridge.instance) {
      //const tx = await bridge.instance.setGreeting(inputGreeting)
      const tx = await bridge.instance._expiry();
      //const fuji = await fujiBridge.instance?._expiry();
      const goerli = await goerliBridge?._expiry();
      console.log("expiry", {tx, goerli}, goerliBridge?.address);
    }
  }
  return (
    <div>
      <p>{message}</p>
      <input onChange={(e) => setInputGreeting(e.target.value)}></input>
      <button onClick={(e) => handleSetGreeting(e)}>Set greeting</button>
    </div>
  )
}
