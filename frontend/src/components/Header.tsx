import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'
import { EnableEthereum } from '../localTypes'
import useStyles from '../styles/header'
import { getNetwork } from '../utils/network'
import { Provider } from '@ethersproject/providers'


const formatAccount = (account: string): string => {
  const start = account.slice(0,6)
  const end = account.slice(-4)
  return `${start}...${end}`
}

type HeaderProps = {
  account: string,
  enableEthereum: EnableEthereum | undefined,
  provider: Provider | undefined
}

function Header({account, enableEthereum, provider}: HeaderProps) {
  const classes: any = useStyles()
  const [network, sNetwork] = useState<string>()

  useEffect(() => {
    if (provider) getNetwork(provider, sNetwork)
  }, [provider])

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
