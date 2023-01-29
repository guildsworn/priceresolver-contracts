module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    // Deployer for PriceResolverOracleContract ELD Token
    let args = []
    const deployContract = await deploy("PriceResolverOracleContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: confirmations, // variable from config
    });
    log(`PriceResolverOracleContract Instance at ${deployContract.address}`);    
}
module.exports.tags = ["all", "deploy", "oracle", "priceresolver", "deploy-priceresolver-oracle"];