const { 
    developmentChains,
    TEST_RESERVE_ELD_COIN_AMOUNT,
    TEST_RESERVE_STABLE_COIN_AMOUNT,
    TEST_INITIAL_STABLE_COIN_AMOUNT } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { log } = deployments;
    const { deployer, player1, player2, player3} = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    if (developmentChains.includes(network.name)) {
        const stableCoinInstance = await deployments.get("ERC20MockContract")
        if (!stableCoinInstance) {
            // Init test stable token and mint some stable tokens to players
            const stableCoinInstance = await ethers.getContract("ERC20MockContract", deployer)
            let transactionResponse = await stableCoinInstance.init([player1, player2, player3], Array(3).fill(TEST_INITIAL_STABLE_COIN_AMOUNT));
            await transactionResponse.wait(confirmations)
            log(`Initialization of ERC20MockContract Instance at ${stableCoinInstance.address} finished.`);
        }
    }
}
module.exports.tags = ["all", "init", "test", "init-test"];
module.exports.dependencies = ["deploy-test"]; 