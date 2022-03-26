import React from "react";
import ReactDOM from "react-dom";
import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { providers } from "ethers";
import { Provider as WagmiProvider, defaultChains } from "wagmi";
import { AccountProvider } from "./context/AccountContext";
import { InjectedConnector } from 'wagmi/connectors/injected'
import {Provider as RProvider} from 'react-redux';
import store from "./redux/store";

// Provider that will be used when no wallet is connected (aka no signer)
const provider = providers.getDefaultProvider(process.env.REACT_APP_PROVIDER_URL/* ,{
  infura: process.env.REACT_APP_INFURA_KEY,
  alchemy: process.env.REACT_APP_ALCHEMY_KEY
} */);


const connector = [
  new InjectedConnector({
    chains: defaultChains.filter(c => c.id === 4),
    //options: { shimDisconnect: true }
  })
]


ReactDOM.render(
  <React.StrictMode>
    <WagmiProvider /* autoConnect */ provider={provider} connectors={connector}>
      <AccountProvider>
        <RProvider store={store}>
          <ChakraProvider>
            <ColorModeScript initialColorMode="light"></ColorModeScript>
            <App />
          </ChakraProvider>
        </RProvider>
      </AccountProvider>
    </WagmiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
