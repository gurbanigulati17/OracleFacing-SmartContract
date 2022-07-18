# OracleFacing-SmartContract
This project demonstrates a basic Hardhat setup for interaction with the Shamba Geospatial Oracle using the Oracle Facing Smart Contracts inheriting the Shamba Smart-Contract-Kit.

# Hardhat Setup for interacting with Oracle Facing Smart Contracts

This project demonstrates a basic Hardhat setup for interaction with the Shamba Geospatial Oracle using the Oracle Facing Smart Contracts inheriting the Shamba Smart-Contract-Kit. 


### First install the required dependencies mentioned in package.json:

```
npm install
```

### Configure the environment variables including ALCHEMY_POLYGON_URL, ACCOUNT_PRIVATE_KEY and POLYGONSCAN_API_KEY by creating a .env file:

> ALCHEMY_POLYGON_URL="Login into Alchemy and create an app using https://dashboard.alchemyapi.io/apps/ and copy the HTTPS url from the 'View Key' option"<br /><br />
> ACCOUNT_PRIVATE_KEY="Export your Metamask Wallet private key"<br /><br />
> POLYGONSCAN_API_KEY="Login into https://polygonscan.com/login and generate API key"<br /><br />


### Deploy the contract by running the deploy.js script:

```
npx hardhat run scripts/deploy.js
```

### Verify and publish the contract on https://mumbai.polygonscan.com/:

```
npx hardhat verify DEPLOYED_CONTRACT_ADDRESS --contract contracts/OracleFacingGeoConsumer.sol:OracleFacingGeoConsumer
```

### Interact with the contract using the tasks defined in the tasks folder

#### Fund the deployed contract with 1 LINK per Oracle request: 
        
```
npx hardhat fund --contract DEPLOYED_CONTRACT_ADDRESS --links 1
```

#### Send the request to the Shamba Geospatial Oracle by passing the required 7 parameters:

> **NOTE**: To learn about the parameters, you can check the Shamba Docs (https://docs.shamba.app/) and also interact with the Shamba Contracts Tool (https://contracts.shamba.app/).

```
npx hardhat sendRequest --contract DEPLOYED_CONTRACT_ADDRESS agg_mean COPERNICUS/S2_SR NDVI 250 2021-09-01 2021-09-10 "[[1,"[[[19.51171875,4.214943141390651],[18.28125,-4.740675384778361],[26.894531249999996,-4.565473550710278],[27.24609375,1.2303741774326145],[19.51171875,4.214943141390651]]]"]]"
```


#### Fetch the data returned by the Shamba Geospatial Oracle:

```
npx hardhat getLatestData --contract DEPLOYED_CONTRACT_ADDRESS
```

```
npx hardhat getLatestCid --contract DEPLOYED_CONTRACT_ADDRESS
```

### Deploy and Run Frontend

1. To run the frontend, open terminal and run command cd client
2. Install respective npm packages with npm install command
3. Then to run the application, type npm start and hit enter
4. Your app will be locally hosted and running on a server: http://localhost:3000/
5. Firstly, you will require to connect your wallet

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/connect-wallet1.png)


6. Once wallet is set up, implicitly it will check for the sufficient balance available to make the send request to the contract (this will be in terms of the LINK available on the polygon test network)
7. If sufficient balance is not available, it will display a message as "Insufficient balance. Please fund the contract at <OracleFacing_GeoConsumer_Address> with 1 LINK per Oracle call"

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/Insufficient_balance.png)


8. If the suffiecient balance is available, you will see a button for the Send Request

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/Sufficient_balance.png)


9. To fund the contract, input number of links in the text field and click on the "Fund Contract" button

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/Fund-link.png)


10. To make a request to fetch data, click on Send Request button (Note this will only be visible if contract has sufficient link available)

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/Sufficient_balance.png)


11. To get the latest CID, click on the Get latest CID button

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/latest-cid.png)


12. To get the latest data, click on the Get Latest Data button

![alt text](https://github.com/gurbanigulati17/OracleFacing-SmartContract/blob/main/output/latest-data.png)





