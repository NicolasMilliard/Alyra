// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @author Cyril Castagnet (modify by Nicolas Milliard)
 * @notice Voting system with simple majority. From Project #1 of Alyra
 * @dev ...
*/

contract Voting is Ownable {

    uint public winningProposalID;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /// @notice Get the details of a voter.
    /// @dev Only a voter can check details of a voter.
    /// @param _addr is the address of the voter we want to check his details.
    /// @return Voter details (isRegistered, hasVoted and votedProposalId).
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Get the details of a proposal.
    /// @dev Only a voter can check details of a voter.
    /// @param _id is the id of the proposal we want to check it's details.
    /// @return Proposal details (description and voteCount).
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }
    
    /// @notice Administrator add voters to the whitelist. A voter can only be authorized once.
    /// @dev Only the owner of the contract can call this function.
    /// @dev Set isRegistered for the address to true.
    /// @param _addr is the address of the Voter who is added by the owner.
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voters registration is not open yet");
        require(voters[_addr].isRegistered != true, "Already registered");
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /// @notice Voters can register their proposal.
    /// @dev Only voters can call this function.
    /// @dev The maximum number of proposals is 100 to avoid DoS Gas limit attack on tallyVotes()
    /// @param _desc is necessary to check if the proposal is not empty.
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
        require(proposalsArray.length < 100, "We can't accept more than 100 proposals");
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "You can't propose nothing");

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    /// @notice Voters can vote for their favorite proposal. A voter can only vote once.
    /// @dev Only voters can call this function. Voter's vote is registered (votedProposalId).
    /// @dev voteCount of the _id is increments by one.
    /// @param _id is the id of the proposal selected by the Voter.
    function setVote(uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found");

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    /// @notice Administrator starts proposals registration session.
    /// @dev Only the owner of the contract can call this function.
    /// @dev The first proposal is called GENESIS
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals can't be started now");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Administrator ends proposals registration session.
    /// @dev Only the owner of the contract can call this function.
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposals havent started yet");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Administrator starts voting session.
    /// @dev Only the owner of the contract can call this function.
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Registering proposals phase is not finished");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Administrator ends voting session.
    /// @dev Only the owner of the contract can call this function.
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Administrator tally votes.
    /// @dev Only the owner of the contract can call this function.
    /// @dev Set winningProposalId. If there is an equality, the first proposal with the highest voteCount is selected.
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}