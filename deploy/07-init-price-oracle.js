const {developmentChains, ORACLE_TOKEN_PRICE,
    ORACLE_STABLE_PRICE} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, admin, moderator } = await getNamedAccounts();
    const [ deployerSigner, adminSigner, moderatorSigner] = await ethers.getSigners();
    const confirmations = network.blockConfirmations || 1;
    
    let priceResolverInstance = await ethers.getContract("PriceResolverOracleContract", deployer);    
    let isInitialised = await priceResolverInstance.isInitialised();
    if (!isInitialised) { 
        // Initialization
        let eldCoinInstance = await ethers.getContract("EldfallTokenContract", deployer)    
        let stableTokenAddress = network.stableTokenAddress ?? "0x0000000000000000000000000000000000000000";
        if (developmentChains.includes(network.name)) {
            let stableCoinInstance = await deployments.get("ERC20MockContract")
            if (!stableCoinInstance) {
                stableTokenAddress = await ethers.getContract("ERC20MockContract", deployer).address;
            } else {
                stableTokenAddress = stableCoinInstance.address;
            }
        }

        let transactionResponse = await priceResolverInstance.init(admin, moderator, eldCoinInstance.address, stableTokenAddress);
        await transactionResponse.wait(confirmations);
        log(`Initialization of PriceResolverOracleContract Instance at ${priceResolverInstance.address} finished.`);

        // Set price
        transactionResponse = await priceResolverInstance.connect(moderatorSigner).setPrice(ORACLE_TOKEN_PRICE, ORACLE_STABLE_PRICE);
        await transactionResponse.wait(confirmations);
        log(`Seting token and stable price on PriceResolverOracleContract Instance at ${priceResolverInstance.address} finished.`);
    } else {
        log(`Initialization of PriceResolverOracleContract already finished.`);
    }
}
module.exports.tags = ["all", "init", "oracle", "init-oracle"];
module.exports.dependencies = ["deploy-oracle", "init-test"]; 