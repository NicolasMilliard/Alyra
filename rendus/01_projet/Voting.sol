// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @author Nicolas Milliard
 * @notice Voting system with simple majority. Project #1 from Alyra.
 * @dev Following features have been added in addition to the exercise statement:
 * @dev Equality management / Display the list of proposals / Reset all proposals / Reset session (all voters and all proposals) /
 * @dev Register only unique new proposal (to avoid duplication of proposals)
*/

contract Voting is Ownable {
    
    uint winningProposalId;

    mapping (address => Voter) voters;

    address[] votersAddress;
    Proposal[] allProposals;
    /// @dev equalProposals is needed to start a new vote in case of an equality.
    Proposal[] equalProposals;

    enum WorkflowStatus { RegisteringVoters, ProposalsRegistrationStarted, ProposalsRegistrationEnded, VotingSessionStarted, VotingSessionEnded, VotesTallied }
    WorkflowStatus public votingStatus;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    /// @notice Event called in case of an equality
    event Equality(Proposal[] equalProposals);

    /// @notice Check if the address is whitelisted.
    modifier checkVoter {
        require(voters[msg.sender].isRegistered, "Your address is not whitelisted.");
        _;
    }

    /// @notice Reset voters and proposals.
    /// @dev Only the owner of the contract can call this function.
    /// @dev Reset hasVoted and votedProposalId in the mapping, delete votersAddress array and call resetProposals function.
    /// @dev Reset votingStatus to register voters.
    function resetSession() external onlyOwner {
        require(votingStatus == WorkflowStatus.VotesTallied, "Session must be finished to be reseting.");

        resetProposals();

        delete votersAddress;
        
        updateWorkflow(WorkflowStatus.RegisteringVoters);
    }

    /// @notice Reset only proposals. Function is external because admin can reset only proposals if needed.
    /// @dev Only the owner of the contract can call this function.
    /// @dev Winning proposal is reset and both allProposals and equalProposals arrays are delete (equalProposals represent proposals in case of an equality).
    /// @dev Reset votingStatus with startProposalsRegistration() to register proposals.
    function resetProposals() public onlyOwner {
        require(votingStatus == WorkflowStatus.VotesTallied, "Session must be finished to reset proposals.");
        winningProposalId = 0;

        for(uint i = 0; i < votersAddress.length; i++) {
            voters[votersAddress[i]].hasVoted = false;
            voters[votersAddress[i]].votedProposalId = 0;
        }
        
        delete allProposals;
        delete equalProposals;

        updateWorkflow(WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Administrator add voters to the whitelist. A voter can only be authorized once.
    /// @dev Only the owner of the contract can call this function.
    /// @dev Set isRegistered for the address to true and store this address in votersAddress array.
    /// @param _address is the address of the Voter who is added by the owner.
    function authorized(address _address) external onlyOwner {
        require(votingStatus == WorkflowStatus.RegisteringVoters, "You can't add address to the whitelist for now.");
        require(!voters[_address].isRegistered, "Your address is already whitelisted.");

        voters[_address].isRegistered = true;

        votersAddress.push(_address);

        emit VoterRegistered(_address);
    }

    /// @notice Administrator starts proposals registration session.
    /// @dev Only the owner of the contract can call this function.
    function startProposalsRegistration() external onlyOwner {
        require(votingStatus == WorkflowStatus.RegisteringVoters, "You can't start registering proposals for now.");
        updateWorkflow(WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Voters can register their proposal.
    /// @dev Only voters can call this function.
    /// @dev checkProposals is called to check if this proposals wasn't already be added to allProposals array.
    /// @dev allProposals array is incremented at each new proposal so allProposals.length - 1 is equal to the index of the right proposal.
    /// @param _description is necessary to check if the proposal has already been register.
    function registerProposals(string calldata _description) external checkVoter {
        require(votingStatus == WorkflowStatus.ProposalsRegistrationStarted, "You can't register proposals for now.");

        Proposal memory proposal;
        proposal.description = _description;

        checkProposals(proposal.description);

        allProposals.push(proposal);
        
        emit ProposalRegistered(allProposals.length - 1);
    }

    /// @notice Administrator ends proposals registration session.
    /// @dev Only the owner of the contract can call this function.
    function endProposalsRegistration() external onlyOwner {
        require(votingStatus == WorkflowStatus.ProposalsRegistrationStarted, "You can't end registering proposals for now.");
        updateWorkflow(WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Display all proposals for all voters.
    /// @dev Only voters can call this function.
    /// @return Proposal[] which contains description and voteCount for each proposal.
    function displayProposals() external checkVoter view returns(Proposal[] memory) {
        return allProposals;
    }

    /// @notice Administrator starts voting session.
    /// @dev Only the owner of the contract can call this function.
    function startVotingSession() external onlyOwner {
        require(votingStatus == WorkflowStatus.ProposalsRegistrationEnded, "You can't start voting session for now.");
        updateWorkflow(WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Voters can vote for their favorite proposal. A voter can only vote once.
    /// @dev Only voters can call this function. Voter's vote is registered (votedProposalId).
    /// @dev voteCount of the _proposalId is increments by one.
    /// @param _proposalId is the id of the proposal selected by the Voter.
    function vote(uint _proposalId) external checkVoter {
        require(votingStatus == WorkflowStatus.VotingSessionStarted, "You can't vote for now.");
        require(!voters[msg.sender].hasVoted, "You have already vote once.");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        
        allProposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    /// @notice Administrator ends voting session.
    /// @dev Only the owner of the contract can call this function.
    function endVotingSession() external onlyOwner {
        require(votingStatus == WorkflowStatus.VotingSessionStarted, "You can't vote for now.");
        updateWorkflow(WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Administrator starts tally session.
    /// @dev Only the owner of the contract can call this function.
    function startTallySession() external onlyOwner {
        require(votingStatus == WorkflowStatus.VotingSessionEnded, "You can't start tally session for now.");
        updateWorkflow(WorkflowStatus.VotesTallied);
    }

    /// @notice Administrator tally votes.
    /// @dev Only the owner of the contract can call this function.
    /// @dev Call getHighestVoteCount function. Compare all voteCount of each proposals and store proposals with an equal voteCount in a new array (equalProposals).
    /// @dev If there is no equality, winningProposalId is set.
    function tallyVotes() external onlyOwner {
        require(votingStatus == WorkflowStatus.VotesTallied, "You can't tally votes for now.");
        
        uint highestNumber = getHighestVoteCount();

        for(uint i = 0; i < allProposals.length; i++) {
            if(allProposals[i].voteCount == highestNumber) {
                winningProposalId = i;
                equalProposals.push(Proposal(allProposals[i].description, 0));
            }
        }
        
        /// @dev If there is an equality: equalProposals.length must contains at least 2 proposals.
        if(equalProposals.length > 1) {
            emit Equality(equalProposals);

            delete allProposals;

            /// @dev Save equalProposals into allProposals.
            for(uint i = 0; i < equalProposals.length; i++) {
                allProposals.push(Proposal(equalProposals[i].description, 0));
            }
            
            delete equalProposals;

            /// @dev Reset all hasVoted and votedProposalId for all voters.
            for(uint i = 0; i < votersAddress.length; i++) {
                voters[votersAddress[i]].hasVoted = false;
                voters[votersAddress[i]].votedProposalId = 0;
            }

            /// @dev Restart voting session with equal proposals.            
            updateWorkflow(WorkflowStatus.VotingSessionStarted);
        }
    }

    /// @notice A voter can check the vote of another voter.
    /// @dev Only voters can call this function.
    /// @dev Function revert if the target voter hasn't voted yet.
    /// @param _address is the address of a Voter to get his vote.
    /// @return votedProposalId
    function getSpecificVote(address _address) external checkVoter view returns(uint) {
        require(voters[_address].hasVoted == true, "This voter doesn't have voted yet.");

        return voters[_address].votedProposalId;
    }

    /// @notice Everyone can check the winner's proposal details.
    /// @return winning proposal's description.
    function getWinner() external view returns(string memory) {
        require(votingStatus == WorkflowStatus.VotesTallied, "You can't get the winner for now.");
        return allProposals[winningProposalId].description;
    }

    /// @notice Update the Workflow status.
    /// @param _newStatus is the next status of the WorkflowStatus.
    function updateWorkflow(WorkflowStatus _newStatus) private {
        WorkflowStatus previousStatus = votingStatus;
        votingStatus = _newStatus;

        emit WorkflowStatusChange(previousStatus, votingStatus);
    }

    /// @dev Called by registerProposals. Revert if keccak256 of two descriptions are equal.
    /// @param _description is the description of a new proposal suggested by a Voter.
    function checkProposals(string memory _description) private view {
        for(uint i = 0; i < allProposals.length; i++) {
            if(keccak256(abi.encode(_description)) == keccak256(abi.encode(allProposals[i].description))) {
                revert("This proposal has been already sent.");
            }
        }
    }

    /// @dev Called by tallyVotes.
    /// @return highestNumber voteCount number for a proposal.
    function getHighestVoteCount() private view returns(uint highestNumber) {
        for(uint i = 0; i < allProposals.length; i++) {
            if(allProposals[i].voteCount > highestNumber) {
                highestNumber = allProposals[i].voteCount;
            }
        }
        return highestNumber;
    }
}