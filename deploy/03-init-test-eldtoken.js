module.exports = async ({ getNamedAccounts, deployments, network, guildsworn }) => {
    const { log } = deployments;
    const { deployer, admin} = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    if (!network.live) {
        let eldfallTokenAddress = await guildsworn.getEldfallTokenAddress(false);
        let eldfallTokenInstance = await ethers.getContractAt("EldfallTokenContract", eldfallTokenAddress, deployer)
        let isInitialised = await eldfallTokenInstance.isInitialised();
        if (!isInitialised) {
            // Initialization
            const minters = [];
            let transactionResponse = await eldfallTokenInstance.init(admin, minters);
            await transactionResponse.wait(confirmations);
            log(`Initialization of EldfallTokenContract Instance at ${eldfallTokenInstance.address} finished.`);
        } else {
            log(`Initialization of EldfallTokenContract already finished.`);
        }
    }
}

module.exports.tags = ["all", "init", "test", "init-test-eldtoken"];
module.exports.dependencies = ["deploy-test-eldtoken"];