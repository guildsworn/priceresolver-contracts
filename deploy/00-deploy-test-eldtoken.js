module.exports = async ({ getNamedAccounts, deployments, network, guildsworn }) => {
    if (!network.live) {
        let eldfallTokenAddress = await guildsworn.getEldfallTokenAddress(false);
        if (!eldfallTokenAddress || eldfallTokenAddress == "0x0000000000000000000000000000000000000000") {
            const deploy_script = require("@guildsworn/token-contracts/deploy/00-deploy-eldtoken");
            await deploy_script({getNamedAccounts, deployments, network});
        }
    }
};

module.exports.tags = ["all", "deploy", "test", "deploy-test-eldtoken"];