const { 
    developmentChains,
    TEST_RESERVE_ELD_COIN_AMOUNT,
    TEST_RESERVE_STABLE_COIN_AMOUNT,
    TEST_INITIAL_STABLE_COIN_AMOUNT, getStableTokenAddress } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, player1, player2, player3} = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    if (developmentChains.includes(network.name)) {
        let stableTokenAddress = await getStableTokenAddress(network, deployments);        
        if (stableTokenAddress && stableTokenAddress != "0x0000000000000000000000000000000000000000") {
            // Init test stable token and mint some stable tokens to players
            stableCoinInstance = await ethers.getContractAt("ERC20MockContract", stableTokenAddress, player1)
            let transactionResponse = await stableCoinInstance.init([player1, player2, player3], Array(3).fill(TEST_INITIAL_STABLE_COIN_AMOUNT));
            await transactionResponse.wait(confirmations)
            log(`Initialization of ERC20MockContract Instance at ${stableCoinInstance.address} finished.`);
        }
    }
}
module.exports.tags = ["all", "init", "test", "init-test"];
module.exports.dependencies = ["deploy-test"]; 