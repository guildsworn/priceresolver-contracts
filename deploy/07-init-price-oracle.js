const {getStableTokenAddress, getEldfallTokenAddress} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, admin, moderator } = await getNamedAccounts();
    const [ deployerSigner, adminSigner, moderatorSigner] = await ethers.getSigners();
    const confirmations = network.blockConfirmations || 1;
    
    let priceResolverInstance = await ethers.getContract("PriceResolverOracleContract", deployer);    
    let isInitialised = await priceResolverInstance.isInitialised();
    if (!isInitialised) { 
        // Initialization
        const eldCoinAddress = await getEldfallTokenAddress(network, deployments); 
        const stableTokenAddress = await getStableTokenAddress(network, deployments);

        let transactionResponse = await priceResolverInstance.init(admin, moderator, eldCoinAddress, stableTokenAddress);
        await transactionResponse.wait(confirmations);
        log(`Initialization of PriceResolverOracleContract Instance at ${priceResolverInstance.address} finished.`);        
    } else {
        let isModeratorModerator = await priceResolverInstance.hasRole(await priceResolverInstance.MODERATOR_ROLE(), moderator);
        log(`Initialization of PriceResolverOracleContract already finished.`);
    }
}
module.exports.tags = ["all", "init", "oracle", "init-oracle"];
module.exports.dependencies = ["deploy-oracle", "init-test"]; 