import React from 'react';
import useEth from '../../contexts/EthContext/useEth';

const BtnConnectWallet = () => {
  const { connectWallet, currentAccount } = useEth();

  return (
    <button className='btn btn-rounded' onClick={connectWallet}>
      {/* Display five firsts characters of the address and the last four */}
      {!currentAccount ? 'Connect your wallet' : `${currentAccount.slice(0, 5)}...${currentAccount.slice(currentAccount.length - 4)}`}  
    </button>
  )
}

export default BtnConnectWallet