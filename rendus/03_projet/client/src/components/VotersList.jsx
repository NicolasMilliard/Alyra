import React from 'react';

import useEth from '../contexts/EthContext/useEth';

const VotersList = ({ voters }) => {
    const { currentAccount } = useEth();
    return (
        <>
            {
                voters.length > 0 &&
                    <div className="flex flex-col container">
                        <h4 className='mb-1'>Voters list</h4>
                        <ul>
                            {voters.map(address => (
                                address === currentAccount ?
                                    <li key={address} className='first-color'>{address}</li>
                                :
                                    <li key={address}>{address}</li>
                            ))}
                        </ul>
                    </div>
            }
        </>
    )
}

export default VotersList