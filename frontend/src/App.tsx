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
import Header from './components/Header';

const { useState, useEffect } = React;

function App() {
  const classes: any = useStyles();
  const [provider, setProvider] = useState<Provider>();
  const [account, setAccount] = useState<string>('');

  useEffect(() => {
    if (!provider) getAndSetProvider(setProvider);
    window.ethereum.on('networkChanged', function () {
      getAndSetProvider(setProvider);
    })
  })

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) setAccount(window.ethereum.selectedAddress);
    window.ethereum.on('accountsChanged', function (accounts: Array<string>) {
      setAccount(accounts[0]);
    });
  }, [window.ethereum.selectedAddress])

  return (
    <ThemeProvider theme={theme}>
      <Symfoni autoInit={true} >
        <div className={classes.root}>
          <Header
            account={account}
            provider={provider}
            enableEthereum={undefined}
          />
          <Bridge></Bridge>
        </div>
      </Symfoni>
    </ThemeProvider>
  );
}

export default App;
