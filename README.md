<img src="/lotteryapp/src/eth-bg.png" width="900">
# Installation
    
`npm install //root folder`

`npm install //lotteryapp folder`

Next, Populate your env values, rename `env.example` to `.env`

```
ETHERSCAN_API_KEY=ABC123ABC123ABC123ABC123ABC123ABC1
RINKEBY_URL=https://eth-rinkeby.alchemyapi.io/v2/<YOUR ALCHEMY KEY>
PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
PRIVATE_KEY_USER_2=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
PRIVATE_KEY_USER_3=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
VRF_SUBSCRIPTION_ID=000
```

```
> npx hardhat deploy --network rinkeby

deploying "LotteryData" (tx: 0xec7bedb5779aef960191ae6996b85ddc61279f4b78417aa5739e57f130089ef6)...: deployed at <YOUR Deployed Address> with 1310966 gas
deploying "Lottery" (tx: 0xd3786519c6447ae29bbe6054289d6d9e50bb4b3d7f762f9b52bc8ea8a80fae09)...: deployed at <YOUR Deployed Address> with 1883638 gas
----------------------------------------------------
VRF subscriptionId 460
Lottery Data Deployed On <YOUR Deployed Address> network rinkeby
Lottery Deployed On <YOUR Deployed Address> network rinkeby

```

Next, Copy the deployed Lottery ABI [`Lottery.json`] from  `deployments/rinkeby` folder which gets generated once you execute the above command.
Copy that to `lotteryapp/src/contracts` and populate your env values, rename `env.example` to `.env` 

```
REACT_APP_LOTTERY_CONTRACT=
REACT_APP_INFURA_KEY=
REACT_APP_ALCHEMY_KEY=
REACT_APP_PROVIDER_URL=
```

Next, Go to the lotteryapp folder
```
> npm start
```
# Demo

<img src="/eth-winner.gif" width="900">

