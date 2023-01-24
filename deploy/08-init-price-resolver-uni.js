const {getEldfallTokenAddress} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, admin, moderator } = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;
    
    let priceResolverInstance = await ethers.getContract("PriceResolverUniV2Contract", deployer);    
    let isInitialised = await priceResolverInstance.isInitialised();
    if (!isInitialised) { 
        // Initialization
        const eldCoinAddress = await getEldfallTokenAddress(network, deployments);         
        let uniswapV2PairContractInstance = network.dexPairAddressEldUsdt ? await ethers.getContractAt("UniswapV2PairMockContract", network.dexPairAddressEldUsdt) : await ethers.getContract("UniswapV2PairMockContract", deployer);
                
        let transactionResponse = await priceResolverInstance.init(admin, moderator, eldCoinAddress, uniswapV2PairContractInstance.address);
        await transactionResponse.wait(confirmations);
        log(`Initialization of PriceResolverUniV2Contract Instance at ${priceResolverInstance.address} finished.`);
    } else {
        log(`Initialization of PriceResolverUniV2Contract already finished.`);
    }
}
module.exports.tags = ["all", "init", "uni", "init-uni"];
module.exports.dependencies = ["deploy-uni", "init-test-uni"]; 