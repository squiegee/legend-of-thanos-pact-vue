
# legend-of-thanos-pact-vue


The Legend of Thanos Pact + Vue 2.6 Kadena NFT Dapp Tutorial 

A simple NFT factory dapp/tutorial on the Kadena Blockhain exploring a few concepts:

- Connecting a Kadena k:account to a dapp
- Connecting X-wallet to a dapp
- Interacting with the Kadena Blockchain with pact-lang-api.js and vue 2.6
- Minting different NFTs utilizing the poly-fungi-v1.pact interface
- Reading NFT balances from the Kadena Blockchain with pact local calls
- Handling pending transactions with a vuex frontend 

Includes a vue frontend interacting with a testnet contract on the Kadena Blockchain.

The dapp's blockchain contract is also included in the /contracts directory, along with .repl test files.


![Logo](https://legendofthanos.zethra.io/legendofthanos.png)


## Installation

Download project and install with npm & node 14.16.1

```bash
  npm i
```

The Legend of Thanos has Vue History Mode enabled (more info here: https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode ) in order to function properly:

A .htaccess file is most likely required in the apps /public directory to test this vue dapp properly.

An example file named 'htaccess' has been included in the /public directory.

Feel free to rename this 'htaccess' file to '.htaccess' or create your own configuration to enable vue history mode and test the frontend.

Other vue history mode server configurations are available at: https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode 

    
## Demo

Demo available at:

https://legendofthanos.zethra.io

