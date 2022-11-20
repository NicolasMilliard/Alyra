import React from 'react';
import img from '../../images/lets-vote-logo.png';
import BtnConnectWallet from '../../components/buttons/BtnConnectWallet';

const Title = () => {
  return (
    <div className='flex flex-center'>
      <img src={img} alt="Let's vote!" />
      <div>
        <div id="title-container" className='mb-4'>
          <div className='title'>Vote for</div>
          <div className="carousel">
            <div className="changeHidden">
              <div className="contenant">
                <div className="element first-color">your future</div>
                <div className="element first-color">Cyril the goat</div>
                <div className="element first-color">DEX instead of CEX</div>
                <div className="element first-color">Alyra school</div>
              </div>
            </div>
          </div>
        </div>
        <BtnConnectWallet />
      </div>
    </div>
  )
}

export default Title