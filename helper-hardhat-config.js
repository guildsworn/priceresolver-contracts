require('dotenv').config();

const networkConfig = {
    23295: {
        name: "oasis_sapphire_testnet",
        stableTokenAddress: "0x0000000000000000000000000000000000000000", // TODO: USDt
    },
    23294: {
        name: "oasis_sapphire_mainnet",
        stableTokenAddress: "0x0000000000000000000000000000000000000000" , // TODO: USDt
    },
    137: {
        name: "Poligon",
        dexPairAddressEldUsdt: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // TODO: change this
        stableTokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // TODO: USDt
    },

}

const developmentChains = ["hardhat", "localhost", "testnet", "oasis_sapphire_testnet"]
const TEST_INITIAL_STABLE_COIN_AMOUNT = ethers.utils.parseUnits("2000", "ether") // Will be minted to test players
const TEST_RESERVE_ELD_COIN_AMOUNT = ethers.utils.parseUnits("900000", "ether") // Will be set as ELD reserve amount in UniswapV2PairMockContract
const TEST_RESERVE_STABLE_COIN_AMOUNT = ethers.utils.parseUnits("900000", "ether") // Will be set as Stable Coin reserve amount in UniswapV2PairMockContract
const ORACLE_TOKEN_PRICE = ethers.utils.parseUnits("1", "ether") // 1 USD
const ORACLE_STABLE_PRICE = ethers.utils.parseUnits("1", "ether") // 1 ELD

const getStableTokenAddress = async (network, deployments) => {
    // 1. Check if we have stable token address in network config
    if (network.stableTokenAddress) {
        return network.stableTokenAddress;
    }

    if (developmentChains.includes(network.name)) {
        // 2. Check if we have test stable token in deployments
        try {
            let stableTokenInstance = await deployments.get("ERC20MockContract");
            return stableTokenInstance.address;
        }
        catch (e) {            
        }

        // 3. Check if we have local test stable token
        try {
            let stableTokenInstance = await ethers.getContract("ERC20MockContract");
            return stableTokenInstance.address;
        }
        catch (e) {            
        }
    }
    return "0x0000000000000000000000000000000000000000";
}

const getEldfallTokenAddress = async (network, deployments) => {
    // 1. Check if we have eld token address in network config
    if (network.eldfallTokenAddress) {
        return network.eldfallTokenAddress;
    }

    if (developmentChains.includes(network.name)) {
        // 2. Check if we have test eld token in deployments
        try {
            let eldfallTokenInstance = await deployments.get("EldfallTokenContract");
            return eldfallTokenInstance.address;
        }
        catch (e) {
        }

        // 3. Check if we have local test stable token
        try {
            let eldfallTokenInstance = await ethers.getContract("EldfallMockTokenContract");
            return eldfallTokenInstance.address;
        }
        catch (e) {
        }
    }
    return "0x0000000000000000000000000000000000000000";
}

module.exports = {
    networkConfig,
    developmentChains,
    TEST_RESERVE_ELD_COIN_AMOUNT,
    TEST_RESERVE_STABLE_COIN_AMOUNT,
    TEST_INITIAL_STABLE_COIN_AMOUNT,
    ORACLE_TOKEN_PRICE,
    ORACLE_STABLE_PRICE,
    getStableTokenAddress,
    getEldfallTokenAddress
}