# ⚡️ Projet - Système de vote 2
## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Results](#results)

<a name="general-info"></a>
### General Info
***

[Voting.test.js](https://github.com/NicolasMilliard/Alyra/blob/main/rendus/02_projet/test/Voting.test.js) regroup all the tests about the Smart Contract [Voting.sol](https://github.com/lecascyril/CodesRinkeby/blob/main/voting.sol).\
To respect the vision of the smart contract, **Voting.test.js** is divided in several contextes regarding the Smart Contract Voting.sol. This means this testing file contains 5 sections:
1. Getters
2. Registration
3. Proposal
4. Vote
5. State

However some tests uses ```expectRevert.unspecified()```. It shows some use cases are missing in the Smart Contract and need to be includes with ```require()``` or ```modifier()```.\
In a professional environment, these ```expectRevert.unspecified()``` must be communicate to the developers team to help them correct the Smart Contract.

<a name="technologies"></a>
### Technologies
***
A list of technologies used within the project:
* [Truffle](https://trufflesuite.com/truffle/): Version 5.6.1
* [Ganache](https://trufflesuite.com/ganache/): Version 7.4.4
* [Solidity](https://github.com/ethereum/solc-js): Version 0.8.17 (solc-js)
* [Node](https://nodejs.org/en/): Version 16.14.2
* [Web3.js](https://web3js.org/): Version 1.7.4
* [@openzeppelin/contracts](https://docs.openzeppelin.com/contracts/4.x/): Version ^4.7.3
* [@openzeppelin/test-helpers](https://docs.openzeppelin.com/test-helpers/0.5/): Version ^0.5.16
* [@truffle/hdwallet-provider](https://github.com/trufflesuite/truffle): Version ^2.1.0
* [chai](https://www.chaijs.com/): Version ^4.3.6
* [eth-gas-reporter](https://github.com/cgewecke/eth-gas-reporter): Version 0.2.25

<a name="installation"></a>
### Installation
***
```sh
# Clone the repository
git clone https://github.com/NicolasMilliard/Alyra.git
cd Alyra/rendus/02_projet

# Start the local blockchain in a terminal
ganache

# Launch the test in another terminal
truffle test
```

<a name="results"></a>
### Results
***

```
    Contract: Voting
    
✨ CONTEXT: Testing getters when WorflowStatus == RegisteringVoters

      • Get voter
        √ should return Voter of the provided address (9ms)
        √ should return a non Voter of the provided address (isRegistered == false) (13ms)
        √ should revert (You're not a voter) (127ms)
      • Get one proposal
        √ should revert (there is no proposal during this context) (18ms)
        √ should get winningProposalID (12ms)
    
✨ CONTEXT: Testing getters when WorflowStatus == ProposalsRegistrationStarted

      • Get voter
        √ should return Voter of the provided address (5ms)
      • Get one proposal
        √ should return Proposal of the id 0 (8ms)
        √ should return Proposal of the id 1 (7ms)
        √ should revert (proposal 2 doesn't exist) (22ms)
        √ should get winningProposalID (4ms)

✨ CONTEXT: Testing getters when WorflowStatus == VotingSessionStarted

      • Get voter
        √ should return Voter of the provided address (4ms)
      • Get one proposal
        √ should return Proposal of the id 0 (6ms)
        √ should return Proposal of the id 1 (5ms)
        √ should revert (proposal 2 doesn't exist) (16ms)
        √ should get winningProposalID (4ms)

✨ CONTEXT: Register a Voter

      • Add voter
        √ should register a voter (sender is the owner) (26ms, 49619 gas)
        √ should revert (Ownable: caller is not the owner.) (17ms)
        √ should revert (Voters registration is not open yet) (35ms, 94254 gas)
        √ should revert (voter is Already registered) (44ms, 49619 gas)

✨ CONTEXT: Register a Proposal

      • Add proposal
        √ should add proposal if sender is a voter (55ms, 152361 gas)
        √ should revert (You're not a voter) (43ms, 94254 gas)
        √ should revert (Proposals are not allowed yet) (14ms)
        √ should revert (Vous ne pouvez pas ne rien proposer) (44ms, 94254 gas)

✨ CONTEXT: Set a vote

      • Set Vote     
        √ should vote for a proposal if sender is a voter (25ms, 77064 gas)
        √ should revert (You're not a voter) (10ms)
        √ should revert (Voting session haven't started yet) (24ms, 30098 gas)
        √ should revert (You have already voted) (44ms, 77064 gas)
        √ should revert (Proposal not found) (17ms)
    
✨ CONTEXT: Testing state

      • Start Proposals Registering
        √ should update status to ProposalsRegistrationStarted (21ms, 94254 gas)
        √ should revert (Ownable: caller is not the owner.) (17ms)
        √ should revert (Registering proposals cant be started now) (39ms, 94254 gas)
      • End Proposals Registering
        √ should update status to endProposalsRegistering (16ms, 30155 gas)
        √ should revert (Ownable: caller is not the owner.) (9ms)
        √ should revert (Registering proposals havent started yet) (51ms, 30155 gas)
      • Start Voting Session
        √ should update status to startVotingSession (24ms, 30113 gas)
        √ should revert (Ownable: caller is not the owner.) (9ms)
        √ should revert (Registering proposals phase is not finished) (27ms, 30113 gas)
      • End Voting Session
        √ should update status to endVotingSession (15ms, 30098 gas)
        √ should revert (Ownable: caller is not the owner.) (16ms)
        √ should revert (Voting session havent started yet) (36ms, 30098 gas)
      • Tally Votes
        √ should update status to VotesTallied (26ms, 60059 gas)
        √ should update winningProposalID (28ms, 60059 gas)
        √ should revert (Ownable: caller is not the owner.) (5ms)
        √ should revert (Current status is not voting session ended) (42ms, 60059 gas)
```

```sh
·------------------------------------------|---------------------------|-------------|----------------------------·
|   Solc version: 0.8.17+commit.8df45f5f   ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|···························|·············|·····························
|  Methods                                                                                                        │
·············|·····························|·············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min        ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·          -  ·          -  ·      58107  ·          30  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·          -  ·          -  ·      49619  ·          44  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·          -  ·          -  ·      30155  ·          25  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·          -  ·          -  ·      30098  ·          11  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·          -  ·          -  ·      77064  ·          22  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·          -  ·          -  ·      94254  ·          41  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·          -  ·          -  ·      30113  ·          23  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·          -  ·          -  ·      60059  ·           5  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Deployments                             ·                                         ·  % of limit  ·             │
···········································|·············|·············|·············|··············|··············
|  Voting                                  ·          -  ·          -  ·    1095394  ·      16.3 %  ·          -  │
·------------------------------------------|-------------|-------------|-------------|--------------|-------------·

  44 passing (48s)
```