import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'
import { EnableEthereum } from '../localTypes'
import useStyles from '../styles/header'
import { getNetwork } from '../utils/network'
import { Provider } from "@ethersproject/providers"


const formatAccount = (account: string): string => {
  const start = account.slice(0,6)
  const end = account.slice(-4)
  return `${start}...${end}`
}

type HeaderProps = {
  account: string,
  isStatus: boolean,
  enableEthereum: EnableEthereum,
  provider: Provider
}

function Header({account, enableEthereum, provider}: HeaderProps) {
  const classes: any = useStyles()
  const [network, sNetwork] = useState<string>()

  useEffect(() => {
    if (account) getNetwork(provider, sNetwork)
  }, [account])

  return (
    <div className={classes.root}>
      {network && <div className={classes.networkIndicator} />}
      {network && <Typography className={classes.network}>
        {network}
      </Typography>}
      <Typography component={'span'} className={classNames(classes.connect, {[classes.connected]: !!account})} onClick={!account ? enableEthereum : console.log}>
        {!!account && <div className={classes.connectedText}>
          <div className={classes.accountText}>{formatAccount(account)}</div>
          <div>Connected</div>
        </div>}
        {!account && <span>Connect</span>}
      </Typography>
    </div>
  )
}

export default Header
