# ⚡️ Projet - Système de vote 3
## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Results](#results)

<a name="general-info"></a>
### General Info
***
Let's Vote! is a dApp working on Ethereum Goerli Testnet based on the boilerplate **Truffle Unbox React**. In case you need Goerli ETH, you can use [this faucet](https://goerlifaucet.com/).\
This dApp is using this [Smart Contract](https://github.com/NicolasMilliard/Alyra/blob/main/rendus/03_projet/truffle/contracts/Voting.sol).

<a name="technologies"></a>
### Technologies
***
A list of technologies used within the project:
* [Truffle](https://trufflesuite.com/truffle/): Version 5.6.1
* [Truffle React Box](#https://trufflesuite.com/boxes/react/)
* [Ganache](https://trufflesuite.com/ganache/): Version 7.4.4
* [Solidity](https://github.com/ethereum/solc-js): Version 0.8.17 (solc-js)
* [Dotenv](https://github.com/motdotla/dotenv): Version ^16.0.3
* [Node](https://nodejs.org/en/): Version 16.14.2
* [Web3.js](https://web3js.org/): Version ^1.7.5
* [@openzeppelin/contracts](https://docs.openzeppelin.com/contracts/4.x/): Version ^4.8.0
* [@openzeppelin/test-helpers](https://docs.openzeppelin.com/test-helpers/0.5/): Version ^0.5.16
* [@truffle/hdwallet-provider](https://github.com/trufflesuite/truffle): Version ^2.0.10
* [React JS](https://fr.reactjs.org/): Version ^18.2.0
* [React Router DOM](https://github.com/remix-run/react-router/tree/main/packages/react-router-dom): Version ^6.4.3

<a name="installation"></a>
### Installation
***
```sh
# Clone the repository
git clone https://github.com/NicolasMilliard/Alyra.git
cd Alyra/rendus/03_projet

# Install dependencies
npm install

# Start the local blockchain in a terminal (optionnal)
ganache

# Deploy the Smart Contract on Ganache in a new terminal (option 1)
cd truffle
truffle migrate --reset

# Deploy the Smart Contract on Goerli in a new terminal (option 2)
truffle migrate --reset --network goerli

# Start the app in a new terminal
cd client
npm run start
```

<a name="results"></a>
### Results
***
An online demonstration is available [on Vercel](#). Also, a demonstration video was made and is accessible [by clicking this link](#).