import React from 'react';
import './App.css';
import { Header } from "./components/Header"
import { Main } from "./components/Main"
import { DAppProvider, Kovan } from "@usedapp/core"

function App() {
  const INFURA_ID = "b5df9c45e61e4bab987ff4205c4bbed1"
  return (
    <DAppProvider config={{
      readOnlyChainId: Kovan.chainId,
      readOnlyUrls: {
        [Kovan.chainId]: `https://kovan.infura.io/v3/${INFURA_ID}`,
      },
    }}>
      <Header />
      <Main />
    </DAppProvider>
  );
}

export default App;
