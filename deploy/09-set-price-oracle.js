const {ORACLE_TOKEN_PRICE, ORACLE_STABLE_PRICE} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, admin, moderator } = await getNamedAccounts();
    const [ deployerSigner, adminSigner, moderatorSigner] = await ethers.getSigners();
    // const confirmations = network.blockConfirmations || 1;
    
    // let priceResolverInstance = await ethers.getContract("PriceResolverOracleContract", deployer);
    // priceResolverInstance = priceResolverInstance.connect(moderatorSigner);

    let priceResolverInstance = await ethers.getContract("PriceResolverOracleContract", moderator);

    let isInitialised = await priceResolverInstance.isInitialised();
    let tokenAddress = await priceResolverInstance.getTokenAddress();
    let tokenPrice = await priceResolverInstance.getTokenPrice();
    let stablePrice = await priceResolverInstance.getStablePrice();
    if (tokenPrice != ORACLE_TOKEN_PRICE && stablePrice != ORACLE_STABLE_PRICE) {
        log(`Setting token and stable price to ${ORACLE_TOKEN_PRICE} token price and ${ORACLE_STABLE_PRICE} stable price on PriceResolverOracleContract Instance at ${priceResolverInstance.address}.`);
        await priceResolverInstance.setPrice(ORACLE_TOKEN_PRICE, ORACLE_STABLE_PRICE);
    } else if (tokenPrice != ORACLE_TOKEN_PRICE) {
        log(`Setting token price to ${ORACLE_TOKEN_PRICE} on PriceResolverOracleContract Instance at ${priceResolverInstance.address}.`);
        await priceResolverInstance.setTokenPrice(ORACLE_TOKEN_PRICE);
    } else if (stablePrice != ORACLE_STABLE_PRICE) {
        log(`Setting stable price to ${ORACLE_STABLE_PRICE} on PriceResolverOracleContract Instance at ${priceResolverInstance.address}.`);
        await priceResolverInstance.setStablePrice(ORACLE_STABLE_PRICE);
    }

    log(`Setting token price and stable price on PriceResolverOracleContract Instance at ${priceResolverInstance.address} finished.`);
}
module.exports.tags = ["all", "set", "oracle", "set-oracle-price"];
module.exports.dependencies = ["init-oracle"]; 