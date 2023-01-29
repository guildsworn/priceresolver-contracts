module.exports = async ({ getNamedAccounts, deployments, network, guildsworn }) => {
    const { log } = deployments;
    const { deployer, admin, moderator } = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;
    
    let priceResolverOracleAddress = await guildsworn.getPriceRosolverOracleAddress();
    let priceResolverOracleInstance = await ethers.getContractAt("PriceResolverOracleContract", priceResolverOracleAddress, deployer)
    let isInitialised = await priceResolverOracleInstance.isInitialised();
    if (!isInitialised) { 
        // Initialization
        const stableTokenAddress = await guildsworn.getStableTokenAddress();
        const eldCoinAddress = await guildsworn.getEldfallTokenAddress();

        let transactionResponse = await priceResolverOracleInstance.init(admin, moderator, eldCoinAddress, stableTokenAddress);
        await transactionResponse.wait(confirmations);
        log(`Initialization of PriceResolverOracleContract Instance at ${priceResolverOracleInstance.address} finished.`);        
    } else {
        log(`Initialization of PriceResolverOracleContract already finished.`);
    }
}
module.exports.tags = ["all", "init", "oracle", "priceresolver", "init-priceresolver-oracle"];
module.exports.dependencies = ["deploy-priceresolver-oracle"]; 