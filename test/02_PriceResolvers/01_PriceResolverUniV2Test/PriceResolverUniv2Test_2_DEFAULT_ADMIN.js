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

describe("PriceResolverUniv2Test_2_DEFAULT_ADMIN", function () {
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
    describe("Salvaging tokens", function () {
        let tokenAmount = ethers.utils.parseEther("1337");
        it("Should be able to salvage tokens", async function () {
            await TokenInstance.mint(PriceResolverInstance.address, tokenAmount);
            expect(await TokenInstance.balanceOf(PriceResolverInstance.address)).to.equal(tokenAmount);
            await PriceResolverInstance.connect(defaultAdmin).salvageTokensFromContract(TokenInstance.address, defaultAdmin.address, tokenAmount);
            expect(await TokenInstance.balanceOf(PriceResolverInstance.address)).to.equal("0");
            expect(await TokenInstance.balanceOf(defaultAdmin.address)).to.equal(tokenAmount);
        });
        it("Should fail if not called from default admin", async function () {
            await TokenInstance.mint(PriceResolverInstance.address, tokenAmount);
            await expect(PriceResolverInstance.connect(moderator).salvageTokensFromContract(TokenInstance.address, defaultAdmin.address, tokenAmount)).to.be.reverted;
        });
    });

    describe("Killing smart contract", function () {
        it("Should fail if not called from default admin", async function () {
            await expect(PriceResolverInstance.connect(moderator).killContract()).to.be.reverted;
        });
        it("Should be able to kill the contract", async function () {
            await PriceResolverInstance.connect(defaultAdmin).killContract();
        });
    });
});