const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let deployer;
let defaultAdmin;
let defaultAdminHash;
let moderator;
let moderatorHash;
let locker;
let vault;
let signer;
let tester1;
let tester2;

let TokenInstance;
let EldTokenInstance;
let UniswapV2PairInstance;
let PriceResolverInstance;

describe("PriceResolverUniv2Test_1_Initialization", function () {
    beforeEach("deploy the contract instance first", async function () {
        [deployer, defaultAdmin, moderator, locker, eldToken, priceResolver, vault, signer, tester1, tester2, minter1] = await ethers.getSigners();

        const TokenFactory = await ethers.getContractFactory("ERC20MockContract");
        TokenInstance = await TokenFactory.deploy();
        await TokenInstance.deployed();

        const EldtokenFactory = await ethers.getContractFactory("EldfallTokenContract");
        EldTokenInstance = await EldtokenFactory.deploy();
        await EldTokenInstance.deployed();
        await EldTokenInstance.init(
            defaultAdmin.address,
            [minter1.address]
        );

        const Uniswapv2PairFactory = await ethers.getContractFactory("UniswapV2PairMockContract");
        UniswapV2PairInstance = await Uniswapv2PairFactory.deploy();
        await UniswapV2PairInstance.deployed();
        await UniswapV2PairInstance.setTokens(EldTokenInstance.address, TokenInstance.address);

        const PriceResolverFactory = await ethers.getContractFactory("PriceResolverUniV2Contract");
        PriceResolverInstance = await PriceResolverFactory.deploy();
        await PriceResolverInstance.deployed();

        // --------------------------
        //   Setting up contracts
        // --------------------------
        defaultAdminHash = await PriceResolverInstance.DEFAULT_ADMIN_ROLE();
        moderatorHash = await PriceResolverInstance.MODERATOR_ROLE();

        await PriceResolverInstance.init(
            defaultAdmin.address,
            moderator.address,
            EldTokenInstance.address,
            UniswapV2PairInstance.address
        );
    });
    describe("Initialization", function () {
        it("Check if init fails if it is called again", async function () {
            await expect(
                PriceResolverInstance.init(
                    defaultAdmin.address,
                    moderator.address,
                    EldTokenInstance.address,
                    UniswapV2PairInstance.address
                )
            ).to.be.reverted;
        });
        it("Check if contract is Initialised", async function () {
            expect(await PriceResolverInstance.isInitialised()).to.be.true;
        });
        it("Check if default admin was set to admin", async function () {
            expect(await PriceResolverInstance.hasRole(defaultAdminHash, defaultAdmin.address)).to.be.true;
        });
        it("Check if deployer is not longer default admin", async function () {
            expect(await PriceResolverInstance.hasRole(defaultAdminHash, deployer.address)).to.be.false;
        });
        it("Check if moderator was set to moderator", async function () {
            expect(await PriceResolverInstance.hasRole(moderatorHash, moderator.address)).to.be.true;
        });
        it("Check if token was set to eld token", async function () {
            expect(await PriceResolverInstance.getTokenAddress()).to.equal(EldTokenInstance.address);
            expect(await PriceResolverInstance.getTokenDecimals()).to.equal(18);
        });
        it("Check if stable token was set to token", async function () {
            expect(await PriceResolverInstance.getStableAddress()).to.equal(TokenInstance.address);
            expect(await PriceResolverInstance.getStableDecimals()).to.equal(18);
        });
        it("Check if DEX was set to UniswapV2Pair", async function () {
            expect(await PriceResolverInstance.getDexPairAddress()).to.equal(UniswapV2PairInstance.address);
        });        
    });
});