import React from 'react';
import useStyles from './styles/app';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './styles/theme';
import { providers } from 'ethers';
import { Provider, Web3Provider } from '@ethersproject/providers'
import { Symfoni } from "./hardhat/SymfoniContext";
import { Greeter } from './components/Greeter';
import { Bridge } from './components/Bridge';
import { AdminBridge } from './components/AdminBridge';
import { getAndSetProvider } from './utils/network';
import { ERC20 } from './types/ERC20';
import { Bridge as IBridge } from './types/Bridge';
import Header from './components/Header';
import { getSNTAvalanche, getSNTEthereum, getBridge } from './utils/contracts';
import { ethereumProvider, avaProvider } from './utils/providers'
import { ethereumAddress, avalancheAddress } from './constants/bridges';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const { useState, useEffect } = React;

function App() {
  const classes: any = useStyles();
  const [provider, setProvider] = useState<Web3Provider>();
  const [account, setAccount] = useState<string>('');
  const [sntEthereum, setSntEthereum] = useState<ERC20>();
  const [sntAvalanche, setSntAvalanche] = useState<ERC20>();
  const [ethereumBridge, setEthereumBridge] = useState<IBridge>();
  const [avalancheBridge, setAvalancheBridge] = useState<IBridge>();
  const [isRelayer, setIsRelayer] = useState<boolean>();

  useEffect(() => {
    if (!provider) getAndSetProvider(setProvider);
    window.ethereum.on('networkChanged', function () {
      getAndSetProvider(setProvider);
    })
  })

  useEffect(() => {
    if (provider) {
      const sntEthereum: ERC20 = getSNTEthereum(ethereumProvider);
      const sntAvalanche: ERC20 = getSNTAvalanche(avaProvider);
      setSntEthereum(sntEthereum);
      setSntAvalanche(sntAvalanche);
    }
  }, [provider])

  useEffect(() => {
    if (!provider) return
    const avalancheBridge: IBridge = getBridge(avalancheAddress, avaProvider);
    avalancheBridge.isRelayer(account).then(isRelayer => {
      setIsRelayer(isRelayer)
    });
    const ethereumBridge: IBridge = getBridge(ethereumAddress, ethereumProvider);
    setEthereumBridge(ethereumBridge);
    setAvalancheBridge(avalancheBridge);
  }, [account])

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) setAccount(window.ethereum.selectedAddress);
    window.ethereum.on('accountsChanged', function (accounts: Array<string>) {
      setAccount(accounts[0]);
    });
  })

  return (
    <ThemeProvider theme={theme}>
      <Symfoni autoInit={true} >
        <div className={classes.root}>
          <Header
            account={account}
            provider={provider}
            enableEthereum={undefined}
            sntEthereum={sntEthereum}
          />
          <Router>
            <Switch>
              <Route path="/relay">
                {!!isRelayer &&  <AdminBridge
                                   account={account}
                                   provider={provider}
                                   sntEthereum={sntEthereum}
                                   sntAvalanche={sntAvalanche}
                                   avalancheBridge={avalancheBridge}
                                   ethereumBridge={ethereumBridge} />}
              </Route>
              <Route path="/">
                {!!ethereumBridge && <Bridge
                                       account={account}
                                       provider={provider}
                                       sntEthereum={sntEthereum}
                                       sntAvalanche={sntAvalanche}
                                       ethereumBridge={ethereumBridge}
                />}
              </Route>
            </Switch>
          </Router>
        </div>
      </Symfoni>
    </ThemeProvider>
  );
}

export default App;
