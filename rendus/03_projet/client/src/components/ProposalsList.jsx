import React, { useState, useEffect } from 'react';

import useEth from '../contexts/EthContext/useEth';

const ProposalsList = ({ proposals, isOwner, isVoter }) => {
    const { state: { contract }, currentAccount } = useEth();
    const [proposalsDetailsList, setProposalsDetailsList] = useState([]);

    // Store proposal id and description in proposalsDetailsList array
    const getProposalsDetails = async() => {
        if(isVoter) {
            let value = [];
            for(let i = 1; i <= proposals.length; i++) {
                let response = await contract.methods.getOneProposal(i).call({from: currentAccount});
                value.push({id: i, description: response.description});
            }
            setProposalsDetailsList(value);
        }
    }

    useEffect(() => {
        if(contract?.methods) {
            getProposalsDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, proposals]);

    return (
        <div className='flex flex-col flex-center'>
            { isOwner && <p className='mb-2'>Actually, voters have made <span className='first-color'>{ proposals.length <= 1 ? `${ proposals.length } proposal` : `${ proposals.length } proposals` }</span>.</p>}

            {
                isVoter && proposalsDetailsList.length > 0 &&
                    <div className="flex flex-col container">
                        <h4 className='mb-1'>Proposals list</h4>
                        <ul>
                            {proposalsDetailsList.map(proposal => (
                                    <li key={proposal.id} id={proposal.id}>{proposal.description}</li>
                            ))}
                        </ul>
                    </div>
            }
        </div>
    )
}

export default ProposalsList