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
import { goerliProvider, avaProvider } from './utils/providers'
import { ethereumAddress, fujiAddress } from './constants/bridges';

const { useState, useEffect } = React;

function App() {
  const classes: any = useStyles();
  const [provider, setProvider] = useState<Web3Provider>();
  const [ethereumProvider, setEthereumProvider] = useState<Provider>();
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
      const sntEthereum: ERC20 = getSNTEthereum(goerliProvider);
      const sntAvalanche: ERC20 = getSNTAvalanche(avaProvider);
      setSntEthereum(sntEthereum);
      setSntAvalanche(sntAvalanche);
    }
  }, [provider])

  useEffect(() => {
    if (!provider) return
    const avalancheBridge: IBridge = getBridge(fujiAddress, avaProvider);
    avalancheBridge.isRelayer(account).then(isRelayer => {
      setIsRelayer(isRelayer)
    });
    const ethereumBridge: IBridge = getBridge(ethereumAddress, provider);
    setEthereumBridge(ethereumBridge);
    setAvalancheBridge(avalancheBridge);
  }, [provider])

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
          {!!ethereumBridge && <Bridge
            account={account}
            provider={provider}
            sntEthereum={sntEthereum}
            sntAvalanche={sntAvalanche}
            ethereumBridge={ethereumBridge}
          />}
          {!!isRelayer &&  <AdminBridge
                           account={account}
                           provider={provider}
                           sntEthereum={sntEthereum}
                           sntAvalanche={sntAvalanche}
                           ethereumBridge={ethereumBridge} />}
        </div>
      </Symfoni>
    </ThemeProvider>
  );
}

export default App;
