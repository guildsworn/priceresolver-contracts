module.exports = async ({ getNamedAccounts, deployments, guildsworn }) => {
    const { log } = deployments;
    const { deployer, moderator } = await getNamedAccounts();
    const confirmations = network.config.blockConfirmations || 1;
    let deployerSigner = await ethers.getSigner(deployer);
    let moderatorSigner = await ethers.getSigner(moderator);
    
    const oracleTokenPrice = process.env.ORACLE_TOKEN_PRICE_ETHER ? ethers.utils.parseUnits(process.env.ORACLE_TOKEN_PRICE_ETHER, "ether") : ethers.utils.parseUnits("1", "ether") // 1 USD
    const oracleStablePrice = process.env.ORACLE_STABLE_PRICE_ETHER ?  ethers.utils.parseUnits(process.env.ORACLE_STABLE_PRICE_ETHER, "ether") : ethers.utils.parseUnits("1", "ether") // 1 ELD
    let priceResolverOracleAddress = await guildsworn.getPriceRosolverOracleAddress();
    let priceResolverOracleWriteInstance = await ethers.getContractAt("PriceResolverOracleContract", priceResolverOracleAddress, moderatorSigner)
    let priceResolverOracleReadInstance = await priceResolverOracleWriteInstance.connect(deployerSigner);

    let tokenPrice = await priceResolverOracleReadInstance.getTokenPrice();
    let stablePrice = await priceResolverOracleReadInstance.getStablePrice();
    if (!tokenPrice.eq(oracleTokenPrice) && !stablePrice.eq(oracleStablePrice)) {
        log(`Setting token and stable price to ${oracleTokenPrice} token price and ${oracleStablePrice} stable price on PriceResolverOracleContract Instance at ${priceResolverOracleReadInstance.address}.`);
        let transactionResponse = await priceResolverOracleWriteInstance.setPrice(oracleTokenPrice, oracleStablePrice);
        await transactionResponse.wait(confirmations);
    } else if (!tokenPrice.eq(oracleTokenPrice)) {
        log(`Setting token price to ${oracleTokenPrice} on PriceResolverOracleContract Instance at ${priceResolverOracleReadInstance.address}.`);
        let transactionResponse = await priceResolverOracleWriteInstance.setTokenPrice(oracleTokenPrice);
        await transactionResponse.wait(confirmations);
    } else if (!stablePrice.eq(oracleStablePrice)) {
        log(`Setting stable price to ${oracleStablePrice} on PriceResolverOracleContract Instance at ${priceResolverOracleReadInstance.address}.`);
        let transactionResponse = await priceResolverOracleWriteInstance.setStablePrice(oracleStablePrice);
        await transactionResponse.wait(confirmations);
    }

    log(`Setting token price and stable price on PriceResolverOracleContract Instance at ${priceResolverOracleReadInstance.address} finished.`);
}
module.exports.tags = ["all", "set", "oracle", "priceresolver", "set-priceresolver-oracle"];
module.exports.dependencies = ["init-priceresolver-oracle"]; 