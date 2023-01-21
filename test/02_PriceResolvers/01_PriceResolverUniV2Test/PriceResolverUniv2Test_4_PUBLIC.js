const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");

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

describe("PriceResolverUniv2Test_4_PUBLIC", function () {
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
        await UniswapV2PairInstance.init(EldTokenInstance.address, TokenInstance.address, utils.parseEther("10000"), utils.parseEther("1000"));

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

    it("getTokenPrice - Token on first place", async function () {
        let tokenPrice = await PriceResolverInstance.connect(tester1).getTokenPrice();
        expect(tokenPrice).to.equal(utils.parseEther("0.1"));
    });
    it("getTokenPrice - Token on second place", async function () {
        let UniswapV2PairInstance2 = await Uniswapv2PairFactory.deploy();
        await UniswapV2PairInstance2.deployed();
        await UniswapV2PairInstance2.init(TokenInstance.address, EldTokenInstance.address, utils.parseEther("10000"), utils.parseEther("1000"));
        await PriceResolverInstance.connect(moderator).setDexPairAddress(UniswapV2PairInstance2.address, EldTokenInstance.address);

        let tokenPrice = await PriceResolverInstance.connect(tester1).getTokenPrice();
        expect(tokenPrice).to.equal(utils.parseEther("10"));
    });

    it("getStablePrice - Token on first place", async function () {
        let tokenPrice = await PriceResolverInstance.connect(tester1).getStablePrice();
        expect(tokenPrice).to.equal(utils.parseEther("10"));
    });
    it("getStablePrice - Token on second place", async function () {
        let UniswapV2PairInstance2 = await Uniswapv2PairFactory.deploy();
        await UniswapV2PairInstance2.deployed();
        await UniswapV2PairInstance2.init(TokenInstance.address, EldTokenInstance.address, utils.parseEther("10000"), utils.parseEther("1000"));
        await PriceResolverInstance.connect(moderator).setDexPairAddress(UniswapV2PairInstance2.address, EldTokenInstance.address);

        let tokenPrice = await PriceResolverInstance.connect(tester1).getStablePrice();
        expect(tokenPrice).to.equal(utils.parseEther("0.1"));
    });
});