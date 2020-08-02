# shopFS

ShopFS is a web3 storage marketplace built upon ethereum smart contracts and private file storage on IPFS using Fleek's space-daemon.
Frontend dapp built using react, redux, web3 & webpack

## Install Dependencies

- Install latest version of nodejs and npm for the host os.
- Install ganache-cli and truffle globally
- Install local dependencies
```
npm install -g truffle ganache-cli
npm install
```

## Run Locally

Start local ethereum blockchain
```
ganache-cli -d -i 4447
```

Deploy StorageMarketPlace contracts.
```
truffle migrate
```

Start the frontend and serve it on `http://localhost:3000`
Make sure metamask is connected to local network "localhost:8545" 

```
npm start
```

## Run tests

```
truffle test
```

## Build App

```
npm run build
```
