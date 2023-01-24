const { 
    developmentChains,
    TEST_RESERVE_ELD_COIN_AMOUNT,
    TEST_RESERVE_STABLE_COIN_AMOUNT,
    TEST_INITIAL_STABLE_COIN_AMOUNT, getStableTokenAddress, getEldfallTokenAddress } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, player1, player2, player3} = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    if (developmentChains.includes(network.name)) {
        // Init UniswapV2PairMockContract
        const eldCoinAddress = await getEldfallTokenAddress(network, deployments);
        const stableTokenAddress = await getStableTokenAddress(network, deployments);
        const uniswapV2PairMockContractInstance = await ethers.getContract("UniswapV2PairMockContract", deployer);
        transactionResponse = await uniswapV2PairMockContractInstance.init(eldCoinAddress, stableTokenAddress, TEST_RESERVE_ELD_COIN_AMOUNT, TEST_RESERVE_STABLE_COIN_AMOUNT);
        await transactionResponse.wait(confirmations);
        log(`Initialization of UniswapV2PairMockContract Instance at ${uniswapV2PairMockContractInstance.address} finished.`);
    }
}
module.exports.tags = ["all", "init", "test", "test-uni", "init-test-uni"];
module.exports.dependencies = ["deploy-test", "deploy-test-uni", "init-test"]; 