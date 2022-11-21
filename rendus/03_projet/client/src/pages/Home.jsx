import React, { useState, useEffect } from 'react';

import Title from '../components/titles/Title';
import TitleUser from '../components/titles/TitleUser';
import Workflow from '../components/Workflow';
import Phase1 from '../components/phases/Phase1';
import Phase2 from '../components/phases/Phase2';
import Phase3 from '../components/phases/Phase3';
import Phase4 from '../components/phases/Phase4';

import useEth from '../contexts/EthContext/useEth';

const Home = () => {
    const { state: { contract }, currentAccount } = useEth();
    const [workflowStatus, setWorkflowStatus] = useState();
    const [isOwner, setIsOwner] = useState(false);
    const [isVoter, setIsVoter] = useState(false);

    // Get workflowStatus
    const refreshWorkflowStatus = async() => {
        const currentWorkflowStatus = Number(await contract.methods.workflowStatus().call());
        setWorkflowStatus(currentWorkflowStatus);
    }

    useEffect(() => {
        if(contract?.methods) {
            refreshWorkflowStatus();
        }
        // eslint-disable-next-line
    }, [contract]);

    // Check if currentAccount is the owner (administrator)
    const checkIsOwner = async() => {
        try {
            const ownerAddress = await contract.methods.owner().call({from: currentAccount});  
            
            if(ownerAddress === currentAccount) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(contract?.methods) {
            checkIsOwner();
        }
        // eslint-disable-next-line
    }, [contract, currentAccount]);

    // Check if currentAccount is a voter
    const checkIsVoter = async() => {
        try {
            await contract.getPastEvents('VoterRegistered', {
                fromBlock: 0,
                toBlock: 'latest'
            },
            (err, events) => {
                for(let i = 0; i < events.length; i++) {
                    if(currentAccount === events[i].returnValues.voterAddress) {
                        setIsVoter(true);
                        return;
                    } else {
                        setIsVoter(false);
                    }
                }
            });            
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        if(contract?.methods) {
            checkIsVoter();
        }
        // eslint-disable-next-line
    }, [contract, currentAccount]);

    return (
        <div className='flex flex-center flex-col'>
            {/* If the user is connected */}
            {
                currentAccount ?
                    // Display a title regarding the role of the user
                    <TitleUser isOwner={isOwner} isVoter={isVoter} />
                :
                    <>
                        {/* If the user is not connected */}
                        <Title />
                    </>
            }
            {/* If the user is connected, workflow is displayed */}
            { currentAccount && <Workflow workflow={workflowStatus} /> }

            {/* Appropriate phase is displayed regarding the worflowStatus */}
            { workflowStatus === 0 && <Phase1 isOwner={isOwner} /> }
            { (workflowStatus === 1 || workflowStatus === 2) && <Phase2 workflow={workflowStatus} isOwner={isOwner} isVoter={isVoter} /> }
            { (workflowStatus === 3 || workflowStatus === 4) && <Phase3 workflow={workflowStatus} isOwner={isOwner} isVoter={isVoter} /> }
            { workflowStatus === 5 && <Phase4 isVoter={isVoter} /> }
        </div>
    )
}

export default Home