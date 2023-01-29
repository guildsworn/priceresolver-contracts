module.exports = async ({ getNamedAccounts, deployments, network, guildsworn }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    let priceResolverOracleAddress = await guildsworn.getPriceRosolverOracleAddress();
    if (!priceResolverOracleAddress || priceResolverOracleAddress == "0x0000000000000000000000000000000000000000") {
        // Deployer for PriceResolverOracleContract ELD Token
        let args = []
        const deployContract = await deploy("PriceResolverOracleContract", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: confirmations, // variable from config
        });
        log(`PriceResolverOracleContract Instance at ${deployContract.address}`);    
    } else {
        log(`PriceResolverOracleContract already deployed at ${priceResolverOracleAddress}`);
    }
}
module.exports.tags = ["all", "deploy", "oracle", "priceresolver", "deploy-priceresolver-oracle"];