import React, { useContext, useEffect, useState } from 'react';
import { BridgeContext, SymfoniBridge } from "./../hardhat/SymfoniContext";
import { Wallet, providers, Contract, VoidSigner, BigNumberish } from "ethers";
import Typography from '@material-ui/core/Typography';
import { Bridge as IBridge } from "../types/Bridge"
import { SNT_ADDRESS } from "../constants/goerliAddress";
import { Formik, FormikProps } from 'formik';
import StatusTextField from './base/TextField';
import useStyles from '../styles/bridge';
import StatusButton from './base/Button';
import { ETHEREUM_CHAIN_ID, AVA_CHAIN_ID } from '../constants/networks';
import { createResourceID, createERCDepositData, toWei } from '../utils/helpers';
import { Web3Provider } from '@ethersproject/providers';
import { ERC20 } from "../types/ERC20";
import { fromWei } from "../utils/helpers"
import { getSetBalance } from "../utils/contracts";
import { ethereumSNTHandlerAddress } from "../constants/bridges";

type IBridgeInfo = {
  amount: string,
  account: string,
}
const wallet = Wallet.createRandom();

interface Props {
  account: string,
  provider: Web3Provider | undefined,
  sntEthereum: ERC20 | undefined,
  sntAvalanche: ERC20 | undefined,
  ethereumBridge: IBridge
}
const FUJI_BRIDGE = '0xE57Eb49689bCAE4dE61D326F7E79Bd14aB527f0f';
const GOERLI_BRIDGE = '0xD0E461b1Dc56503fC72565FA964C28E274146D44';
const fujiProvider = new providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
const goerliProvider = new providers.InfuraProvider("goerli");
const fujiSigner = new Wallet(wallet.privateKey, fujiProvider);
const fujiVoidSigner = new VoidSigner(wallet.address, fujiProvider);
const goerliVoidsigner = new VoidSigner(wallet.address, goerliProvider);


export const Bridge: React.FC<Props> = ({ account, provider, sntEthereum, sntAvalanche, ethereumBridge }) => {
  const classes: any = useStyles()
  const bridge: SymfoniBridge = useContext(BridgeContext);
  const [message, setMessage] = useState("");
  const [inputGreeting, setInputGreeting] = useState("");
  const [goerliBridge, setGoerliBridge] = useState<IBridge>();
  const [fujiBridge, setFujiBridge] = useState<IBridge>();
  const [sntEthereumBalance, setSntEthereumBalance] = useState<BigNumberish>();
  const [sntAvalancheBalance, setSntAvalancheBalance] = useState<BigNumberish>();
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

  useEffect(() => {
    getSetBalance(sntEthereum, account, setSntEthereumBalance);
  }, [account])

  useEffect(() => {
    getSetBalance(sntAvalanche, account, setSntAvalancheBalance);
  }, [account])

  return (
    <Formik
      initialValues={{
        amount: '',
        account
      }}
      onSubmit={async (values) => {
        const { amount, account } = values;
        const weiAmount = toWei(amount);
        const resourceId = createResourceID(SNT_ADDRESS, ETHEREUM_CHAIN_ID);
        const encodedData = createERCDepositData(toWei(amount), account);
        if (!provider) return;
        const signer = provider.getSigner()
        const sntActiveProvider = sntEthereum?.connect(signer);
        const activeBridge = ethereumBridge.connect(signer);
        if(!bridge || !bridge.instance) return
        const approved = await sntActiveProvider?.allowance(account, ethereumSNTHandlerAddress);
        if (approved?.lt(weiAmount)) {
          const amt = approved.eq(0) ? weiAmount : toWei('0');
          //TODO approve handler not bridge
          await sntActiveProvider?.approve(ethereumSNTHandlerAddress, amt);
        } else {
          console.log({AVA_CHAIN_ID, resourceId, encodedData});
          const deposit = await activeBridge.deposit(
            AVA_CHAIN_ID,
            resourceId,
            encodedData
          );
          if (deposit) {
            const receipt = await deposit.wait(1);
            console.log({receipt});
          }
        }
      }}
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
            {!!sntEthereumBalance && <Typography className={classes.balanceText}>
              SNT Ethereum balance: {fromWei(sntEthereumBalance)}
            </Typography>}
            {!!sntAvalancheBalance && <Typography className={classes.balanceText}>
              SNT Avalanche balance: {fromWei(sntAvalancheBalance)}
            </Typography>}
            <StatusTextField
              className={fieldWidth}
              name="amount"
              label="Enter amount of SNT to send across bridge"
              idFor="amount"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.amount}
            />
            <StatusTextField
              className={fieldWidth}
              name="account"
              label="account receiving across bridge"
              idFor="account"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.account}
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
