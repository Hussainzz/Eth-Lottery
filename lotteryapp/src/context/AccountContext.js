import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useConnect} from "wagmi";

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [{ data, error, loading }, connect] = useConnect();
  const [{data: accountQuery}, disconnect] = useAccount();

  const [connectedAddr, setConnectedAddr] = useState('');
  const [connected, setConnected] = useState(false);
  const [allowSignIn, setAllowSignIn] = useState(false);
  const [netWorkName, setNetworkName] = useState('');
  const [accountErrorMessage, setAccountErrorMessage] = useState('');

  useEffect(() => {
    if (error?.name === "ConnectorNotFoundError") {
      alert("MetaMask extension required to sign in");
    }
  }, [error, loading]);

  useEffect(() => {
    if ((accountQuery?.address && allowSignIn)) {
      setConnectedAddr(accountQuery.address);
      setConnected(true);
    }else{
      setConnectedAddr('');
      setConnected(false);
    }
  }, [loading, allowSignIn]);


  const connectToMetaMask = async () => {
    const c = await connect(data.connectors[0]);
    if(c.data?.chain.id){
      checkChain(c.data.chain.id);
    }
  };

  const checkChain = (cId) => {
    const connectedNetwork = getSupportedNetworks(cId)
    if(typeof connectedNetwork == 'undefined'){
      setAccountErrorMessage('Please Connect To Rinkeby Test Network');
      setAllowSignIn(false);
      setNetworkName('')
      disconnect();
    }else{
      setAllowSignIn(true);
      setNetworkName(connectedNetwork)
    }
  }

  data.connectors[0].onDisconnect = () => {
    console.log('disss')
  }

  data.connectors[0].onAccountsChanged = () => {
    window.location.reload();
  }

  data.connectors[0].onChainChanged = (chainId) => {
    const connectedNetwork = getSupportedNetworks(chainId)
    if(typeof connectedNetwork == 'undefined'){
      window.location.reload();
    }
  }

  return (
    <AccountContext.Provider value={{
      connected, 
      connectedAddr,
      connectToMetaMask,
      disconnect,
      loading,
      netWorkName,
      accountErrorMessage
    }}>{children}</AccountContext.Provider>
  );
};


function getSupportedNetworks(chainId){
  const networks = {
    1337:"Localhost 8545",
    31337:"Localhost 8545",
    4: "Rinkeby",
    '0x4': "Rinkeby"
  };
  return networks[chainId];
}

export function useMetaMaskAccount(){
  return useContext(AccountContext);
}