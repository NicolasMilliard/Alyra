import React, { useState, useEffect } from 'react';
import ButtonLoader from '../buttons/ButtonLoader';
import VotersList from '../VotersList';

import useEth from '../../contexts/EthContext/useEth';

const Phase1 = ({ isOwner }) => {
    const { state: { contract }, currentAccount } = useEth();
    const [newVoter, setNewVoter] = useState("");
    const [votersList, setVotersList] = useState([]);
    const [addVoterIsLoading, setAddVoterIsLoading] = useState(false);
    const [startProposalsIsLoading, setStartProposalsIsLoading] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Handle value of input and check if it's an ethereum address
    const handleVoter = e => {
        if(/^0x[a-fA-F0-9]{40}$/.test(e.target.value)) {
            setNewVoter(e.target.value);
            setShowErrorMessage(false);
        } else if(e.target.value.length === 0) {
            setShowErrorMessage(false);
        } else {
            setShowErrorMessage(true);
        }
    }

    // If newVoter is an ethereum address, addVoter method is used
    const addVoter = async() => {
        if(/^0x[a-fA-F0-9]{40}$/.test(newVoter)) {
            try {
                // Display loader
                setAddVoterIsLoading(true);

                await contract.methods.addVoter(newVoter).send({from: currentAccount});
                setShowSuccessMessage(true);
                setVotersList([...votersList, newVoter]);

                // Hide loader
                setAddVoterIsLoading(false);
            } catch (error) {
                // Hide loader
                setAddVoterIsLoading(false);
                console.log(error);
            }
        } else {
            setShowErrorMessage(true);
        }
    }

    // Gest past voters
    const getPastVoters = async() => {
        await contract.getPastEvents('VoterRegistered', {
            fromBlock: 0,
            toBlock: 'latest'
        },
        (err, events) => {
            for(let i = 0; i < events.length; i++) {
                if(!votersList.includes(events[i].returnValues.voterAddress)) {
                    setVotersList([...votersList, events[i].returnValues.voterAddress]);
                }
            }
        });
    }

    useEffect(() => {
        if(contract?.methods) {
            getPastVoters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, votersList]);
    

    // Update workflowStatus
    const startProposalsRegistering = async() => {
        try {
            // Display loader
            setStartProposalsIsLoading(true);

            await contract.methods.startProposalsRegistering().send({from: currentAccount});

            // Hide loader
            setStartProposalsIsLoading(false);
            
            // Reload the page to display Phase 2
            window.location.reload();
        } catch (error) {
            // Hide loader
            setStartProposalsIsLoading(false);
            console.log(error);
        }
    }

  return (
    <section>
        { isOwner &&
            <>
                <div className='flex flex-col flex-center mb-4'>
                    <div className='flex'>
                        <input type="text" onChange={handleVoter} className="input" placeholder="0x..." />
                        {
                            addVoterIsLoading ?
                                <ButtonLoader aspect="btn" />
                            :
                                <button className='btn' onClick={addVoter}>
                                    Add a voter
                                </button>
                        }
                    </div>
                    <p className='mt-1'>Number of voters: {votersList.length}</p>
                    <div>
                        {showErrorMessage ? <p className='msg-error mt-1'>This address is incomplete or wrong.</p> : ''}
                        {showSuccessMessage ? <p className='msg-success mt-1'>The address '{newVoter}' was correctly added.</p> : ''}
                    </div>
                </div>
                <div className='flex flex-col flex-center mb-4'>
                    {
                        startProposalsIsLoading ?
                            <ButtonLoader aspect="btn btn-rounded" />
                        :
                            <button className='btn btn-rounded' onClick={startProposalsRegistering}>
                                Start Proposals Registering
                            </button>
                    }
                </div>
            </>
        }
        {/* VotersList is display to everyone */}
        <VotersList voters={votersList} />
    </section>
  )
}

export default Phase1