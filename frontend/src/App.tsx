import React from 'react';
import useStyles from './styles/app';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './styles/theme';
import { providers } from 'ethers';
import { Provider } from '@ethersproject/providers'
import { Symfoni } from "./hardhat/SymfoniContext";
import { Greeter } from './components/Greeter';
import { Bridge } from './components/Bridge';
import { getAndSetProvider } from './utils/network';
import { ERC20 } from './types/ERC20';
import Header from './components/Header';
import { getISntEthereum } from './utils/contracts';
import { goerliProvider } from './utils/providers'

const { useState, useEffect } = React;

function App() {
  const classes: any = useStyles();
  const [provider, setProvider] = useState<Provider>();
  const [ethereumProvider, setEthereumProvider] = useState<Provider>();
  const [account, setAccount] = useState<string>('');
  const [sntEthereum, setSntEthereum] = useState<ERC20>();

  useEffect(() => {
    if (!provider) getAndSetProvider(setProvider);
    window.ethereum.on('networkChanged', function () {
      getAndSetProvider(setProvider);
    })
  })

  useEffect(() => {
    if (provider) {
      const snt: ERC20 = getISntEthereum(goerliProvider)
      setSntEthereum(snt);
    }
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
          <Bridge
            account={account}
            provider={provider}
            sntEthereum={sntEthereum}
          />
        </div>
      </Symfoni>
    </ThemeProvider>
  );
}

export default App;
