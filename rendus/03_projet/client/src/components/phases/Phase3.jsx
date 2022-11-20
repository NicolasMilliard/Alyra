import React, { useState, useEffect } from 'react';
import ButtonLoader from '../buttons/ButtonLoader';
import VotersList from '../VotersList';
import ProposalsListVote from '../ProposalsListVote';

import useEth from '../../contexts/EthContext/useEth'; 

const Phase3 = ({ workflow, isOwner, isVoter }) => {
    const { state: { contract }, currentAccount } = useEth();
    const [proposalsList, setProposalsList] = useState([]);
    const [pastVoter, setPastVoter] = useState([]);
    const [endVotingIsLoading, setEndVotingIsLoading] = useState(false);
    const [tallyVotesIsLoading, setTallyVotesIsLoading] = useState(false);

    // Get past proposals (id)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, proposalsList]);

    // Gest past voters
    const getPastVoters = async() => {
        await contract.getPastEvents('Voted', {
            fromBlock: 0,
            toBlock: 'latest'
        },
        (err, events) => {
            for(let i = 0; i < events.length; i++) {
                if(!pastVoter.includes(events[i].returnValues.voter)) {
                    setPastVoter([...pastVoter, events[i].returnValues.voter]);
                }
            }
        });
    }

    useEffect(() => {
        if(contract?.methods) {
            getPastVoters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, pastVoter]);

    const endVotingSession = async() => {
        try {
            // Display loader
            setEndVotingIsLoading(true);

            await contract.methods.endVotingSession().send({from: currentAccount});

            // Display loader
            setEndVotingIsLoading(false);

            // Reload the page
            window.location.reload();
        } catch (error) {
            // Display loader
            setEndVotingIsLoading(false);
            console.log(error);
        }
    }

    const tallyVotes = async() => {
        try {
            // Display loader
            setTallyVotesIsLoading(true);

            await contract.methods.tallyVotes().send({from: currentAccount});

            // Display loader
            setTallyVotesIsLoading(false);
            
            // Reload the page to display Phase 4
            window.location.reload();
        } catch (error) {
            // Display loader
            setTallyVotesIsLoading(false);
            console.log(error);
        }
    }

    return (
        <section>
            { isVoter &&
                <div className='flex flex-col flex-center mb-4'>
                    <ProposalsListVote proposals={proposalsList} isVoter={isVoter} />
                </div>
            }
            { workflow === 3 && isOwner &&
                <>
                    {/* Display End Voting session button */}
                    <div className='flex flex-col flex-center mb-4'>
                        {
                            endVotingIsLoading ?
                                <ButtonLoader aspect="btn btn-rounded" />
                            :
                                <button className='btn btn-rounded' onClick={endVotingSession}>
                                    End Voting session
                                </button>
                        }
                    </div>
                    <>
                        {/* Display total voters and voters list */}
                        <div className='flex flex-col flex-center mb-1'>
                            <p>Actually, <span className='first-color'>{pastVoter.length}</span> {pastVoter.length < 2 ? 'voter has' : 'voters have'} voted.</p>
                        </div>
                        <VotersList voters={pastVoter} />
                    </>
                </>
            }
            { workflow === 4 && isOwner &&
                <div className='flex flex-col flex-center'>
                    {
                        tallyVotesIsLoading ?
                            <ButtonLoader aspect="btn btn-rounded" />
                        :
                            <button className='btn btn-rounded' onClick={tallyVotes}>
                                Tally votes
                            </button>
                    }
                </div>
            }
        </section>
    )
}

export default Phase3