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

describe("PriceResolverUniV2Test_0_Deployment", function () {
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
    });
    describe("Deployment", function () {
        it("Check if default admin was set to deployer", async function () {
            expect(await PriceResolverInstance.hasRole(defaultAdminHash, deployer.address)).to.be.true;
        });
        it("Check if contract is not Initialised", async function () {            
            expect(await PriceResolverInstance.isInitialised()).to.be.false;
        }); 
        it("Check if init fails if not called from defaulAdmin", async function () {
            await expect(
                PriceResolverInstance.connect(tester1).init(
                    defaultAdmin.address,
                    moderator.address,
                    EldTokenInstance.address,
                    UniswapV2PairInstance.address
                )
            ).to.be.reverted;
        });
        it("Check if init fails if token is not in pair", async function () {
            await expect(
                PriceResolverInstance.init(
                    defaultAdmin.address,
                    moderator.address,
                    tester1.address,
                    UniswapV2PairInstance.address
                )
            ).to.be.reverted;
        });
        it("Check if init goes through", async function () {
            await PriceResolverInstance.init(
                defaultAdmin.address,
                moderator.address,
                EldTokenInstance.address,
                UniswapV2PairInstance.address
            );
        });
    });
});