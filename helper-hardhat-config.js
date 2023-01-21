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
module.exports = {
    networkConfig,
    developmentChains,
    TEST_RESERVE_ELD_COIN_AMOUNT,
    TEST_RESERVE_STABLE_COIN_AMOUNT,
    TEST_INITIAL_STABLE_COIN_AMOUNT,
    ORACLE_TOKEN_PRICE,
    ORACLE_STABLE_PRICE
}