import React from 'react';
import Logo from './Logo';
import BtnConnectWallet from './buttons/BtnConnectWallet';

const Menu = () => {
  return (
    <div id='menu-container' className='mb-4'>
        <div id='menu' className='flex'>
            <Logo />
            <BtnConnectWallet />
        </div>
    </div>
  )
}

export default Menu