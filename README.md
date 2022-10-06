
# legend-of-thanos-pact-vue


The Legend of Thanos Pact + Vue 2.6 Kadena NFT Dapp Example/Tutorial

A simple NFT factory dapp/example on the Kadena Blockhain exploring a few concepts:

- Connecting a Kadena k:account to a dapp
- Connecting X-wallet to a dapp
- Interacting with the Kadena Blockchain with pact-lang-api.js and vue 2.6
- Minting different NFTs utilizing the poly-fungi-v1.pact interface
- Reading NFT balances from the Kadena Blockchain with pact local calls
- Handling pending transactions with a vuex frontend 

Includes a vue frontend interacting with a testnet contract on the Kadena Blockchain.

The dapp's blockchain contract is also included in the /contracts directory, along with .repl test files.

////////////////
!IMPORTANT NOTE! 10/6/2022 - Kadena has recently deprecated module guards, this smart contract still includes module guards!
\\\\\\\\\\\\\\\\
*Please keep this in mind when using this tutorial for learning purposes as module guards are still found in this code. 
*Also, please note that Kadena is also moving towards moving the public towards their new marmalade NFT design- This smart contract tutorial makes uses of Kadena's Poly-fungible-v1 token interface (older nft design).

![Logo](https://legendofthanos.zethra.io/legendofthanos.png)


## Installation

Browse to project directory and install with npm & node 14.16.1:

```bash
  npm i
```

Run development build:

```bash
  npm run serve
```

    
## Demo

Demo available at:

https://legendofthanos.zethra.io

