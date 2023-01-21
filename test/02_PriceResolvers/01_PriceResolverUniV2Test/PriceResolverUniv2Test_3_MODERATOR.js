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
let Uniswapv2PairFactory;
let UniswapV2PairInstance;
let PriceResolverInstance;

describe("PriceResolverUniv2Test_3_MODERATOR", function () {
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

        Uniswapv2PairFactory = await ethers.getContractFactory("UniswapV2PairMockContract");
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
    it("setDexPairAddress - Fail if not called from tester", async function () {
        UniswapV2PairInstance2 = await Uniswapv2PairFactory.deploy();
        await UniswapV2PairInstance2.deployed();
        await UniswapV2PairInstance2.setTokens(tester1.address, TokenInstance.address);
        await expect(PriceResolverInstance.connect(tester1).setDexPairAddress(UniswapV2PairInstance2.address, tester1.address)).to.be.reverted;
    });
    it("setDexPairAddress - Fail if same value", async function () {
        await expect(PriceResolverInstance.connect(moderator).setDexPairAddress(UniswapV2PairInstance.address, EldTokenInstance.address)).to.be.revertedWith('Value is already set!');
    });
    it("setDexPairAddress - Sucess", async function () {
        UniswapV2PairInstance2 = await Uniswapv2PairFactory.deploy();
        await UniswapV2PairInstance2.deployed();
        await UniswapV2PairInstance2.setTokens(tester1.address, TokenInstance.address);
        await PriceResolverInstance.connect(moderator).setDexPairAddress(UniswapV2PairInstance2.address, tester1.address);
        expect(await PriceResolverInstance.getTokenAddress()).to.equal(tester1.address);
        expect(await PriceResolverInstance.getStableAddress()).to.equal(TokenInstance.address);
        expect(await PriceResolverInstance.getDexPairAddress()).to.equal(UniswapV2PairInstance2.address);
    });
});