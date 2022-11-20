import React, { useState, useEffect } from 'react';
import ButtonLoader from './buttons/ButtonLoader';

import useEth from '../contexts/EthContext/useEth';

const ProposalsListVote = ({ proposals, isVoter }) => {
    const { state: { contract }, currentAccount } = useEth();
    const [proposalsDetailsList, setProposalsDetailsList] = useState([]);
    const [voteIsLoading, setVoteIsLoading] = useState(false);
    const [newVote, setNewVote] = useState("");
    const [votedProposal, setVotedProposal] = useState("");
    const [hasVoted, setHasVoted] = useState();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

    // Vote for a proposal
    const setVote = async(e) => {
        // If the user is a voter
        if(isVoter) {
            // Id of the target must be a number
            if (/^\d+$|^$/.test(e.target.id)) {
                // Call setVote method
                try {
                    // Hide an eventual error message
                    setShowErrorMessage(false);
    
                    // Display loader
                    setVoteIsLoading(true);

                    // Call setVote method, set newVote to the id and display the success message        
                    await contract.methods.setVote(e.target.id).send({from: currentAccount});
                    setNewVote(e.target.id);
                    setShowSuccessMessage(true);
        
                    // Hide loader
                    setVoteIsLoading(false);

                    // Call getVoter method and set hasVoted to true
                    checkHasVoted();
                } catch (error) {
                    // Hide loader
                    setVoteIsLoading(false);
                    console.log(error);
                }
            } else {
                setShowErrorMessage(true);
            }
        }
    }

    // Call getVoter method and set hasVoted to true
    const checkHasVoted = async() => {
        if(isVoter) {
            try {
                const value = await contract.methods.getVoter(currentAccount).call({from: currentAccount});
                setHasVoted(value.hasVoted);
                setNewVote(value.votedProposalId);

                getVotedProposalDescription();
                setShowSuccessMessage(true);
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if(contract?.methods) {
            checkHasVoted()
        }
    });

    // When the user has voted, display a message with the description of this proposal
    const getVotedProposalDescription = async() => {
        if(isVoter) {
            if(newVote.length > 0) {
                try {
                    const response = await contract.methods.getOneProposal(newVote).call({ from: currentAccount });
                    setVotedProposal(response.description);                    
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    useEffect(() => {
        if(contract?.methods) {
            getVotedProposalDescription();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, newVote]);

    return (
        <>
            { !hasVoted && 
                <div className='flex flex-col flex-center'>
                    {
                        isVoter && proposalsDetailsList.length > 0 &&
                            <div className="flex flex-col container">
                                <h4 className='mb-1'>Proposals list</h4>
                                <ul>
                                    {proposalsDetailsList.map(proposal => (
                                            <div key={proposal.id} className='flex flex-center flex-space-between container-row mb-1'>
                                                <li>{proposal.description}</li>
                                                {
                                                    voteIsLoading ?
                                                        <ButtonLoader aspect="btn btn-rounded" />
                                                    :
                                                        <button id={proposal.id} onClick={setVote} className='btn btn-rounded'>
                                                            Vote for this proposal
                                                        </button>
                                                }
                                                <div className='separator'></div>
                                            </div>
                                    ))}
                                </ul>
                            </div>
                    }
                </div>
            }
            <div>
                {isVoter && showErrorMessage && <p className='msg-error mt-1'>Please vote for an existing proposal.</p>}
                {isVoter && showSuccessMessage && newVote > 0 && <p className='msg-success mt-1'>You have correctly voted for the proposal '{votedProposal}'.</p>}
            </div>
        </>
    )
}

export default ProposalsListVote