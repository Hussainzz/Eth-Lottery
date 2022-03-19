const POINT_ONE_LINK = "100000000000000000"
module.exports = async ({getNamedAccounts, deployments, getChainId, network}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    log(chainId);
    log(await getNamedAccounts());

    if (chainId == 31337 || chainId == 1337) {
        log("Local network detected! Deploying mocks...")
        const linkToken = await deploy("LinkToken", { from: deployer, log: true })
        await deploy("VRFCoordinatorV2Mock", {
          from: deployer,
          log: true,
          args: [
            POINT_ONE_LINK,
            1e9, // 0.000000001 LINK per gas
          ],
        })
        await deploy("MockOracle", {
          from: deployer,
          log: true,
          args: [linkToken.address],
        })
        log("Mocks Deployed!");
      }
};

module.exports.tags = ["all", "mocks", "main"]