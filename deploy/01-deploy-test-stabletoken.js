module.exports = async ({ getNamedAccounts, deployments, network, guildsworn }) => {
    if (!network.live) {
        let stableTokenAddress = await guildsworn.getStableTokenAddress(false);        
        if (!stableTokenAddress || stableTokenAddress == "0x0000000000000000000000000000000000000000") {
            const deploy_script = require("@guildsworn/token-contracts/deploy/02-deploy-test");
            await deploy_script({getNamedAccounts, deployments, network});
        }
    }
}
module.exports.tags = ["all", "deploy", "test", "deploy-test-stabletoken"];