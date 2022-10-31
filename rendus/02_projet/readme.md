# ⚡️ Projet - Système de vote 2
## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Results](#results)

<a name="general-info"></a>
### General Info
***

[Voting.test.js](https://github.com/NicolasMilliard/Alyra/blob/main/rendus/02_projet/test/Voting.test.js) regroup all the tests about the Smart Contract [Voting.sol](https://github.com/NicolasMilliard/Alyra/blob/main/rendus/02_projet/contracts/Voting.sol).\
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
* [Hardhat](https://hardhat.org/): Version ^2.12.1
* [hardhat-truffle5](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-truffle5): Version ^2.0.7
* [hardhat-web3](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-web3): Version ^2.0.0
* [solidity-coverage](https://github.com/sc-forks/solidity-coverage): Version ^0.8.2

<a name="installation"></a>
### Installation
***
```sh
# Clone the repository
git clone https://github.com/NicolasMilliard/Alyra.git
cd Alyra/rendus/02_projet

# Install dependencies
npm install

# Start the local blockchain in a terminal
ganache

# Start the test in another terminal
cd Alyra/rendus/02_projet
truffle test
```

Optional:\
To check the coverage of the Smart Contract, you have to use Hardhat, as solidity-coverage not working anymore with Truffle.
```sh
# Install Hardhat
npm install --save-dev hardhat

# Install hardhat-truffle5 to facilitate the use of Hardhat when coming from Truffle
npm install --save-dev @nomiclabs/hardhat-truffle5 @nomiclabs/hardhat-web3 web3

# Install solidity-coverage
npm install --save-dev solidity-coverage

# Start the test with coverage
npx hardhat coverage
```

<a name="results"></a>
### Results
***

```
Contract: Voting
    
✨ CONTEXT: Testing getters when WorkflowStatus == RegisteringVoters

      • Get voter
        √ should return Voter of the provided address (9ms)
        √ should return a non Voter of the provided address (isRegistered == false) (7ms)
        √ should revert (You're not a voter) (230ms)
      • Get one proposal
        √ should revert (You're not a voter) (12ms)
        √ should revert (there is no proposal during this context) (17ms)
        √ should get winningProposalID (3ms)
    
✨ CONTEXT: Testing getters when WorkflowStatus == ProposalsRegistrationStarted

      • Get voter
        √ should return Voter of the provided address (22ms)
      • Get one proposal
        √ should return Proposal of the id 0 (7ms)
        √ should return Proposal of the id 1 (15ms)
        √ should revert (You're not a voter) (15ms)
        √ should revert (proposal 2 doesn't exist) (18ms)
        √ should get winningProposalID (3ms)
    
✨ CONTEXT: Testing getters when WorkflowStatus == VotingSessionStarted

      • Get voter
        √ should return Voter of the provided address (4ms)
      • Get one proposal
        √ should return Proposal of the id 0 (9ms)
        √ should return Proposal of the id 1 (9ms)
        √ should revert (You're not a voter) (20ms)
        √ should revert (proposal 2 doesn't exist) (6ms)
        √ should get winningProposalID (3ms)
    
✨ CONTEXT: Register a Voter

      • Add voter
        √ should register a voter (sender is the owner) (17ms, 49619 gas)
        √ should revert (Ownable: caller is not the owner) (19ms)
        √ should revert (Voters registration is not open yet) (48ms, 94254 gas)
        √ should revert (voter is Already registered) (43ms, 49619 gas)
    
✨ CONTEXT: Register a Proposal

      • Add proposal
        √ should add proposal if sender is a voter (34ms, 152361 gas)
        √ should revert (You're not a voter) (68ms, 94254 gas)
        √ should revert (Proposals are not allowed yet) (18ms)
        √ should revert (Vous ne pouvez pas ne rien proposer) (37ms, 94254 gas)
    
✨ CONTEXT: Set a vote

      • Set Vote
        √ should vote for a proposal if sender is a voter (19ms, 77064 gas)
        √ should revert (You're not a voter) (21ms)
        √ should revert (Voting session haven't started yet) (43ms, 30098 gas)
        √ should revert (You have already voted) (28ms, 77064 gas)
        √ should revert (Proposal not found) (12ms)
    
✨ CONTEXT: Testing state

      • Start Proposals Registering
        √ should update status to ProposalsRegistrationStarted (14ms, 94254 gas)
        √ should revert (Ownable: caller is not the owner) (15ms)
        √ should revert (Registering proposals cant be started now) (50ms, 94254 gas)
      • End Proposals Registering
        √ should update status to endProposalsRegistering (127ms, 30155 gas)
        √ should revert (Ownable: caller is not the owner) (24ms)
        √ should revert (Registering proposals havent started yet) (27ms, 30155 gas)
      • Start Voting Session
        √ should update status to startVotingSession (25ms, 30113 gas)
        √ should revert (Ownable: caller is not the owner) (13ms)
        √ should revert (Registering proposals phase is not finished) (35ms, 30113 gas)
      • End Voting Session
        √ should update status to endVotingSession (13ms, 30098 gas)
        √ should revert (Ownable: caller is not the owner) (16ms)
        √ should revert (Voting session havent started yet) (29ms, 30098 gas)
      • Tally Votes
        √ should update status to VotesTallied (19ms, 60059 gas)
        √ should update winningProposalID (21ms, 60059 gas)
        √ should revert (Ownable: caller is not the owner) (9ms)
        √ should revert (Current status is not voting session ended) (34ms, 60059 gas)
  47 passing (51s)
```

Eth-gas-reporter:
```sh
·------------------------------------------|---------------------------|-------------|----------------------------·
|   Solc version: 0.8.17+commit.8df45f5f   ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|···························|·············|·····························
|  Methods                                                                                                        │
·············|·····························|·············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min        ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·          -  ·          -  ·      58107  ·          33  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·          -  ·          -  ·      49619  ·          48  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·          -  ·          -  ·      30155  ·          26  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·          -  ·          -  ·      30098  ·          11  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·          -  ·          -  ·      77064  ·          24  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·          -  ·          -  ·      94254  ·          43  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·          -  ·          -  ·      30113  ·          24  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·          -  ·          -  ·      60059  ·           5  ·          -  │
·············|·····························|·············|·············|·············|··············|··············
|  Deployments                             ·                                         ·  % of limit  ·             │
···········································|·············|·············|·············|··············|··············
|  Voting                                  ·          -  ·          -  ·    1095394  ·      16.3 %  ·          -  │
·------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```

Solidity-coverage
```sh
-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts\  |      100 |      100 |      100 |      100 |                |
  Voting.sol |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
All files    |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
```

Details for the coverage can be found [at this link](https://htmlpreview.github.io/?https://github.com/NicolasMilliard/Alyra/blob/main/rendus/02_projet/coverage/index.html).