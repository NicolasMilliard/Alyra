import React, { useState, useEffect } from 'react';
import ButtonLoader from '../buttons/ButtonLoader';

import useEth from '../../contexts/EthContext/useEth'; 

const Phase4 = ({ isVoter }) => {
    const { state: { contract }, currentAccount } = useEth();
    const [winner, setWinner] = useState(0);
    const [winnerDescription, setWinnerDescription] = useState("");
    const [winnerVoteCount, setWinnerVoteCount] = useState(0);
    const [winnerIsLoading, setWinnerIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Get winning proposal id
    const winningProposalID = async() => {
        try {
            // Display loader
            setWinnerIsLoading(true);

            setWinner(await contract.methods.winningProposalID().call());
            
            // Hide loader
            setWinnerIsLoading(false);
        } catch (error) {
            // Hide loader
            setWinnerIsLoading(false);
            console.log(error);
        }
    }

    // If user is a voter, get winning proposal details : description and vote count
    const getWinnerDetails = async(value) => {
        if(isVoter) {
            try {
                // Display loader
                setWinnerIsLoading(true);

                const details = await contract.methods.getOneProposal(value).call({from: currentAccount});
                setWinnerDescription(details.description);
                setWinnerVoteCount(Number(details.voteCount));

                setShowSuccessMessage(true);

                // Hide loader
                setWinnerIsLoading(false);                 
            } catch (error) {
                // Hide loader
                setWinnerIsLoading(false); 
                console.log(error);
            }
        }
    }

    useEffect(() => {
        getWinnerDetails(winner);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winner, isVoter]);

    return (
        <section>
            <div className='flex flex-col flex-center'>
                {/* Display Get winning proposal button */}
                <div>
                    {
                        winnerIsLoading ?
                            <ButtonLoader aspect="btn btn-rounded" />
                        :
                            <button className='btn btn-rounded' onClick={winningProposalID}>
                                Get winning proposal
                            </button>
                    }
                </div>
                <div>
                    {/* Display the details of the winning proposal */}
                    {
                        isVoter ?
                            <>
                                {
                                    showSuccessMessage && winner > 0 &&
                                        <p className='msg-success mt-1'>The winning proposal is '{winnerDescription}' with {winnerVoteCount} { winnerVoteCount === 1 ? 'vote' : 'votes'}.</p>
                                }
                            </>
                        :
                            <>
                                {
                                    winner > 0 &&
                                        <p className='msg-success mt-1'>The winning proposal ID is '{winner}'.</p>
                                }
                            </>
                    }                    
                </div>
            </div>
        </section>
    )
}

export default Phase4