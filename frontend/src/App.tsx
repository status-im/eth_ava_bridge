import React from 'react';
import { providers } from 'ethers';
import './App.css';
import { Symfoni } from "./hardhat/SymfoniContext";
import { Greeter } from './components/Greeter';
import { Bridge } from './components/Bridge'
import { getAndSetProvider } from './utils/network'

const { useState, useEffect } = React;
const { Provider } = providers

function App() {
  const [provider, setProvider] = useState<typeof Provider>();

  useEffect(() => {
    if (!provider) getAndSetProvider(setProvider);
  })
  console.log({provider})
  return (
    <div className="App">
      <header className="App-header">
        <Symfoni autoInit={true} >
          <Bridge></Bridge>
        </Symfoni>
      </header>
    </div>
  );
}

export default App;
