import React from 'react'

const Workflow = ({ workflow }) => {
    const workflowStatus = ["RegisteringVoters", "ProposalsRegistrationStarted", "ProposalsRegistrationEnded", "VotingSessionStarted", "VotingSessionEnded", "VotesTallied"];
    
    // Display a progress bar
    return (
        <>
            <h3>Current step is <strong>{workflowStatus[workflow]}</strong></h3>
            <div className='workflow-container mt-1 mb-2'>
                <div className='workflow-bar' style={{ width: `${75 * (workflow + 1)}px`}}></div>
                <div className='workflow-underbar'></div>
            </div>
        </>
    )
}

export default Workflow