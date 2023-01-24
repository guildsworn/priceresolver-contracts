const { developmentChains, getStableTokenAddress, getEldfallTokenAddress } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    if (developmentChains.includes(network.name)) {
        let stableTokenAddress = await getStableTokenAddress(network, deployments);        
        if (!stableTokenAddress || stableTokenAddress == "0x0000000000000000000000000000000000000000") {
            // Deployer for ERC20MockContract only in development
            let args = []
            let deployContract = await deploy("ERC20MockContract", {
                from: deployer,
                args: args,
                log: true,
                waitConfirmations: confirmations, // variable from config
            });
            log(`MOCK Stable Token as USDT Instance at ${deployContract.address}`)   
        }

        let eldfallTokenAddress = await getEldfallTokenAddress(network, deployments);
        if (!eldfallTokenAddress || eldfallTokenAddress == "0x0000000000000000000000000000000000000000") {
            // Deployer for EldfallTokenContract only in development
            let args = []
            let deployContract = await deploy("EldfallMockTokenContract", {
                from: deployer,
                args: args,
                log: true,
                waitConfirmations: confirmations, // variable from config
                contract: "ERC20MockContract"
            });
            log(`MOCK Eldfall Token Instance at ${deployContract.address}`)
        }
    }
}
module.exports.tags = ["all", "deploy", "test", "deploy-test"];