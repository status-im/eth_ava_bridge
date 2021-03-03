import React, { Fragment } from 'react';
import { EnrichedDepositEvent } from "../utils/events"
import Typography from '@material-ui/core/Typography';
import useStyles from '../styles/deposit';
import { chainIDToName } from '../constants/networks';

interface Props {
  deposit: EnrichedDepositEvent
}

const Deposit: React.FC<Props> = ({ deposit }) => {
  const classes: any = useStyles();
  const { cellText } = classes;
  const { decoded, depositRecord } = deposit;
  return (
    <Fragment>
      <Typography className={cellText}>Deposit Nonce: {decoded?.depositNonce.toNumber()}</Typography>
      {!!decoded && <Typography className={cellText}>Destination Chain: {chainIDToName[decoded?.destinationChainID]}</Typography>}
      <Typography className={cellText}>Depositer: {depositRecord?._depositer.toString()}</Typography>
      <Typography className={cellText}>Receiver: {depositRecord?._destinationRecipientAddress.toString()}</Typography>
    </Fragment>
  )
}

export default Deposit
