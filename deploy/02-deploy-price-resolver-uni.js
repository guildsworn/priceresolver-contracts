module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const confirmations = network.blockConfirmations || 1;

    // Deployer for PriceResolverUniV2Contract ELD Token
    let args = []
    const deployContract = await deploy("PriceResolverUniV2Contract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: confirmations, // variable from config
    });
    log(`PriceResolverUniV2Contract Instance at ${deployContract.address}`);    
}
module.exports.tags = ["all", "deploy", "uni", "deploy-uni"];