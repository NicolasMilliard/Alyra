import React, { useState, useEffect } from 'react';
import ButtonLoader from '../buttons/ButtonLoader';
import ProposalsList from '../ProposalsList';

import useEth from '../../contexts/EthContext/useEth';

const Phase2 = ({ workflow, isOwner, isVoter }) => {
    const { state: { contract }, currentAccount } = useEth();
    const [newProposal, setNewProposal] = useState("");
    const [proposalsList, setProposalsList] = useState([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [addProposalIsLoading, setAddProposalIsLoading] = useState(false);
    const [endProposalsIsLoading, setEndProposalsIsLoading] = useState(false);
    const [startVotingIsLoading, setStartVotingIsLoading] = useState(false);

    // When user change of account, success and error messages are hidden
    useEffect(() => {
        setShowErrorMessage(false);
        setShowSuccessMessage(false);
    }, [currentAccount]);

    // Handle value of input and check if proposal is a least two characters
    const handleProposal = e => {
        // Hide success message if user add another proposal
        setShowSuccessMessage(false);
        if(e.target.value.length >= 2) {
            setNewProposal(e.target.value);
            setShowErrorMessage(false);
        } else if(e.target.value.length === 0) {
            setShowErrorMessage(false);
        } else {
            setShowErrorMessage(true);
        }
    }

    // If newProposal is valid, addProposal method is used
    const addProposal = async() => {
        if(newProposal.length >= 2) {
            try {
                // Display loader
                setAddProposalIsLoading(true);

                await contract.methods.addProposal(newProposal).send({from: currentAccount});
                setShowSuccessMessage(true);

                // Hide loader
                setAddProposalIsLoading(false);
            } catch (error) {
                // Hide loader
                setAddProposalIsLoading(false);
                console.log(error);
            }
        } else {
            setShowErrorMessage(true);
        }
    }

    // Gest past proposals
    const getPastProposals = async() => {
        await contract.getPastEvents('ProposalRegistered', {
            fromBlock: 0,
            toBlock: 'latest'
        },
        (err, events) => {
            for(let i = 0; i < events.length; i++) {
                if(!proposalsList.includes(events[i].returnValues.proposalId)) {
                    setProposalsList([...proposalsList, events[i].returnValues.proposalId]);
                }
            }
        });
    }

    useEffect(() => {
        if(contract?.methods) {
            getPastProposals();
        }
    });

    const endProposalsRegistering = async() => {
        try {
            // Display loader
            setEndProposalsIsLoading(true);

            await contract.methods.endProposalsRegistering().send({from: currentAccount});

            // Hide loader
            setEndProposalsIsLoading(false);

            // Reload the page to display Phase 2-1 (Start voting session button)
            window.location.reload();
        } catch (error) {
            // Hide loader
            setEndProposalsIsLoading(false);
            console.log(error);
        }
    }

    const startVotingSession = async() => {
        try {
            // Display loader
            setStartVotingIsLoading(true);

            await contract.methods.startVotingSession().send({from: currentAccount});

            // Hide loader
            setStartVotingIsLoading(false);

            // Reload the page to display Phase 3
            window.location.reload();
        } catch (error) {
            // Hide loader
            setStartVotingIsLoading(false);
            console.log(error);
        }
    }

    return (
        <section>
            <div className='flex flex-col flex-center mb-4'>
                {/* Display proposal form if workflow == 1 and if currentAccount is a voter */}
                {
                    workflow === 1 && isVoter &&
                        <div className='flex'>
                            <input type="text" onChange={handleProposal} className="input" />
                            {
                                addProposalIsLoading ?
                                    <ButtonLoader aspect="btn" />
                                :
                                    <button className='btn' onClick={addProposal}>
                                        Add a proposal
                                    </button>
                            }
                        </div>
                }
                <div>
                    {isVoter && showErrorMessage && <p className='msg-error mt-1'>Please add more details to this proposal.</p>}
                    {isVoter && showSuccessMessage && <p className='msg-success mt-1'>Your proposal '{newProposal}' was added. Do you want to add another proposal?</p>}
                </div>
            </div>
            {/* Dispay the button End Proposals Registering if workflow == 1 and currentAccount is the owner */}
            {
                workflow === 1 && isOwner &&
                    <div className='flex flex-col flex-center mb-4'>
                        {
                            endProposalsIsLoading ?
                                <ButtonLoader aspect="btn btn-rounded" />
                            :
                                <button className='btn btn-rounded' onClick={endProposalsRegistering}>
                                    End Proposals Registering
                                </button>
                        }
                    </div>
            }
            {/* Dispay the button Start Voting session if workflow == 2 and currentAccount is the owner */}
            {
                workflow === 2 && isOwner &&
                    <div className='flex flex-col flex-center mb-4'>
                        {
                            startVotingIsLoading ?
                                <ButtonLoader aspect="btn btn-rounded" />
                            :
                                <button className='btn btn-rounded' onClick={startVotingSession}>
                                    Start Voting session
                                </button>
                        }
                    </div>
            }
            <ProposalsList proposals={proposalsList} isOwner={isOwner} isVoter={isVoter} />
        </section>
    )
}

export default Phase2