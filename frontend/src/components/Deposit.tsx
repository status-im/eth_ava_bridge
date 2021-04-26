import React, { Fragment, ChangeEvent } from 'react';
import { EnrichedDepositEvent } from "../utils/events"
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import useStyles from '../styles/deposit';
import { chainIDToName } from '../constants/networks';

interface Props {
  deposit: EnrichedDepositEvent,
  checked: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
}

const Deposit: React.FC<Props> = ({ deposit, checked, setFieldValue }) => {
  const classes: any = useStyles();
  const { cellText } = classes;
  const { decoded, depositRecord, proposal } = deposit;
  const depositNonce = decoded?.depositNonce.toString()
  return (
    <Fragment>
      <Checkbox
        name={depositNonce}
        checked={checked}
        onChange={() => setFieldValue('selectedDeposit', depositNonce)}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      <Typography className={cellText}>Status: {proposal?.statusName}</Typography>
      <Typography className={cellText}>Deposit Nonce: {decoded?.depositNonce.toNumber()}</Typography>
      {!!decoded && <Typography className={cellText}>Destination Chain: {chainIDToName[decoded?.destinationChainID]}</Typography>}
      <Typography className={cellText}>Depositer: {depositRecord?._depositer.toString()}</Typography>
      <Typography className={cellText}>Receiver: {depositRecord?._destinationRecipientAddress.toString()}</Typography>
    </Fragment>
  )
}

export default Deposit
