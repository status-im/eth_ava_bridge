import React, { useContext, useEffect, useState } from 'react';
import { BridgeContext, SymfoniBridge } from "./../hardhat/SymfoniContext";
import { Wallet, providers, Contract, VoidSigner } from "ethers";
import { Bridge as IBridge } from "../types/Bridge"
import { SNT_ADDRESS } from "../../constants/goerliAddress";
import { Formik, FormikProps } from 'formik';
import StatusTextField from './base/TextField';
import useStyles from '../styles/bridge';
import StatusButton from './base/Button';


type IBridgeInfo = {
  amount: string,
}
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
  const classes: any = useStyles()
  const bridge: SymfoniBridge = useContext(BridgeContext);
  const [message, setMessage] = useState("");
  const [inputGreeting, setInputGreeting] = useState("");
  const [goerliBridge, setGoerliBridge] = useState<IBridge>();
  const [fujiBridge, setFujiBridge] = useState<IBridge>();
  const { fieldWidth } = classes;
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
    <Formik
      initialValues={{
        amount: '',
      }}
      onSubmit={async (values) => {}}
    >
      {({
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue
      }: FormikProps<IBridgeInfo>) => {
        return (
          <form className={classes.root} onSubmit={handleSubmit}>
            <StatusTextField
              className={fieldWidth}
              name="amount"
              label="Enter amount of SNT to send across bridge"
              idFor="Title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.amount}
            />
            <StatusButton
              className={fieldWidth}
              buttonText="Submit"
              onClick={handleSubmit}
            />
          </form>
      )}
      }
      </Formik>

  )
}
