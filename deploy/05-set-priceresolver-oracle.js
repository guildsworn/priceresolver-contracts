module.exports = async ({ getNamedAccounts, deployments, guildsworn }) => {
    const { log } = deployments;
    const { moderator } = await getNamedAccounts();
    
    const oracleTokenPrice = process.env.ORACLE_TOKEN_PRICE_ETHER ? ethers.utils.parseUnits(process.env.ORACLE_TOKEN_PRICE_ETHER, "ether") : ethers.utils.parseUnits("1", "ether") // 1 USD
    const oracleStablePrice = process.env.ORACLE_STABLE_PRICE_ETHER ?  ethers.utils.parseUnits(process.env.ORACLE_STABLE_PRICE_ETHER, "ether") : ethers.utils.parseUnits("1", "ether") // 1 ELD
    let priceResolverOracleAddress = await guildsworn.getPriceRosolverOracleAddress();
    let priceResolverOracleInstance = await ethers.getContractAt("PriceResolverOracleContract", priceResolverOracleAddress, moderator)
    let tokenPrice = await priceResolverOracleInstance.getTokenPrice();
    let stablePrice = await priceResolverOracleInstance.getStablePrice();
    if (tokenPrice != oracleTokenPrice && stablePrice != oracleStablePrice) {
        log(`Setting token and stable price to ${oracleTokenPrice} token price and ${oracleStablePrice} stable price on PriceResolverOracleContract Instance at ${priceResolverOracleInstance.address}.`);
        await priceResolverOracleInstance.setPrice(oracleTokenPrice, oracleStablePrice);
    } else if (tokenPrice != oracleTokenPrice) {
        log(`Setting token price to ${oracleTokenPrice} on PriceResolverOracleContract Instance at ${priceResolverOracleInstance.address}.`);
        await priceResolverOracleInstance.setTokenPrice(oracleTokenPrice);
    } else if (stablePrice != oracleStablePrice) {
        log(`Setting stable price to ${oracleStablePrice} on PriceResolverOracleContract Instance at ${priceResolverOracleInstance.address}.`);
        await priceResolverOracleInstance.setStablePrice(oracleStablePrice);
    }

    log(`Setting token price and stable price on PriceResolverOracleContract Instance at ${priceResolverOracleInstance.address} finished.`);
}
module.exports.tags = ["all", "set", "oracle", "priceresolver", "set-priceresolver-oracle"];
module.exports.dependencies = ["init-priceresolver-oracle"]; 