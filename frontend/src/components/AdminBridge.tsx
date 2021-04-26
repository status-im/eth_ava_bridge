import React, { useContext, useEffect, useState } from 'react';
import { BridgeContext, SymfoniBridge } from "./../hardhat/SymfoniContext";
import { Wallet, providers, Contract, VoidSigner, BigNumberish } from "ethers";
import Typography from '@material-ui/core/Typography';
import { Bridge as IBridge } from "../types/Bridge"
import { SNT_ADDRESS } from "../constants/goerliAddress";
import { SNT_ADDRESS as AVA_SNT_ADDRESS } from "../constants/avalanche";
import { Formik, FormikProps } from 'formik';
import StatusTextField from './base/TextField';
import useStyles from '../styles/adminBridge';
import StatusButton from './base/Button';
import { ETHEREUM_CHAIN_ID, AVA_CHAIN_ID } from '../constants/networks';
import { createResourceID, createERCDepositData, toWei, generateDepositDataHash } from '../utils/helpers';
import { Web3Provider } from '@ethersproject/providers';
import { ERC20 } from "../types/ERC20";
import { fromWei } from "../utils/helpers"
import { getSetBalance } from "../utils/contracts";
import { ethereumSNTHandlerAddress, avalancheSNTHandlerAddress } from "../constants/bridges";
import { getDepositEvents, EnrichedDepositEvent } from "../utils/events";
import Deposit from "./Deposit";

type IBridgeInfo = {
  amount: string,
  account: string,
  selectedDeposit: string
}

interface Props {
  account: string,
  provider: Web3Provider | undefined,
  sntEthereum: ERC20 | undefined,
  sntAvalanche: ERC20 | undefined,
  ethereumBridge: IBridge | undefined,
  avalancheBridge: IBridge | undefined,
}
export const AdminBridge: React.FC<Props> = ({ account, provider, sntEthereum, sntAvalanche, ethereumBridge, avalancheBridge }) => {
  const classes: any = useStyles()
  const bridge: SymfoniBridge = useContext(BridgeContext);
  const [message, setMessage] = useState("");
  const [inputGreeting, setInputGreeting] = useState("");
  const [goerliBridge, setGoerliBridge] = useState<IBridge>();
  const [fujiBridge, setFujiBridge] = useState<IBridge>();
  const [sntEthereumBalance, setSntEthereumBalance] = useState<BigNumberish>();
  const [sntAvalancheBalance, setSntAvalancheBalance] = useState<BigNumberish>();
  const [deposits, setDeposits] = useState<EnrichedDepositEvent[]>();
  const { fieldWidth } = classes;
  useEffect(() => {
    getDepositEvents(ethereumBridge, avalancheBridge, setDeposits)
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
        account: '',
        selectedDeposit: ''
      }}
      onSubmit={async (values) => {
        const { amount, account, selectedDeposit } = values;
        if (!deposits) return
        const deposit = deposits.find(d => d.decoded?.depositNonce.eq(selectedDeposit))
        if (!provider || !deposit) return
        const { depositRecord } = deposit
        if (!depositRecord) return
        const hasPassed = deposit.proposal?.status || 0
        const signer = provider.getSigner();
        const activeBridge = avalancheBridge?.connect(signer);
        const sntAvalancheResourceId = createResourceID(AVA_SNT_ADDRESS, AVA_CHAIN_ID);
        const { _destinationRecipientAddress, _amount } = depositRecord
        const encodedMetaData = createERCDepositData(_amount, _destinationRecipientAddress)
        const depositDataHash = generateDepositDataHash(avalancheSNTHandlerAddress, encodedMetaData);
        const depositNonce = deposit.decoded?.depositNonce;
        const destinationId: number | undefined = deposit.decoded?.destinationChainID;
        if (!depositNonce || !destinationId) return
        const originationId: number = destinationId === ETHEREUM_CHAIN_ID ? AVA_CHAIN_ID : ETHEREUM_CHAIN_ID;
        if (hasPassed) {
          //TODO update UI state on success or fail
          const vote = await activeBridge?.executeProposal(
            originationId,
            depositNonce,
            encodedMetaData,
            sntAvalancheResourceId
          )
        } else {
          const vote = await activeBridge?.voteProposal(
            originationId,
            depositNonce,
            sntAvalancheResourceId,
            depositDataHash
          )
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
              {deposits?.map((d: EnrichedDepositEvent) => <Deposit
                                                            key={d.data}
                                                            checked={d.decoded?.depositNonce.toString() === values.selectedDeposit}
                                                            setFieldValue={setFieldValue}
                                                            deposit={d} />)}
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
