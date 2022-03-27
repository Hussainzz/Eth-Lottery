const config = {
    // Hardhat local network
    // Mock Data (it won't work)
    31337: {
      name: "hardhat",
      keyHash:
        "0x7c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f3",
      fee: "0.1",
      fundAmount: "10000000000000000000",
    },
    //ganache
    1337: {
      name: "ganache",
      keyHash:
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
      fee: "0.1",
      fundAmount: "10000000000000000000",
    },
    // Rinkeby
    4: {
      name: "rinkeby",
      linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
      keyHash:
        "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      fee: "0.25",
      fundAmount: "2000000000000000000",
    },
  };


const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
  
module.exports = {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    config,
};