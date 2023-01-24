// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "hardhat/console.sol";

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./PriceResolverContract.sol";

contract PriceResolverUniV2Contract is PriceResolverContract {
	bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

	IUniswapV2Pair private _dexPairInstance;

	bool private _initialised;
	bool private _tokenIs0;

	// **************************************************
	// *************** DEFAULT_ADMIN REGION *************
	// **************************************************
	constructor() {
		_grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
	}

	function init(
		address defaultAdminAddress_,
		address moderatorAddress_,
		address tokenAddress_,
		address dexPairAddress_
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		require(!_initialised, "Contract is already initialised!");

		_grantRole(DEFAULT_ADMIN_ROLE, defaultAdminAddress_);
		_grantRole(MODERATOR_ROLE, moderatorAddress_);

		_setDexPairAddress(dexPairAddress_, tokenAddress_);

		_initialised = true;
		_revokeRole(DEFAULT_ADMIN_ROLE, _msgSender());
	}

	// **************************************************
	// ***************** MODERATOR REGION ***************
	// **************************************************
	function setDexPairAddress(
		address dexPairAddress_,
		address tokenAddress_
	) public onlyRole(MODERATOR_ROLE) {
		require(
			address(_dexPairInstance) != dexPairAddress_,
			"Value is already set!"
		);
		emit DexPairAddressChanged(address(_dexPairInstance), dexPairAddress_);
		_setDexPairAddress(dexPairAddress_, tokenAddress_);
	}

	// **************************************************
	// ************** PUBLIC GETTERS REGION *************
	// **************************************************	
	function getDexPairAddress() public view returns (address) {
		return address(_dexPairInstance);
	}

	/// @notice Calculate how much cost 1 ELD token in stable tokens
	function getTokenPrice() public override view returns (uint) {
		//TODO: SECURITY Flash loans, take total deposit in calculation
		(uint Res0, uint Res1, ) = _dexPairInstance.getReserves();
		uint oneToken = 1 * 10 ** getTokenDecimals();
		if (_tokenIs0) {
			return ((uint256(Res1) * oneToken) / uint256(Res0));
		} else {
			return ((uint256(Res0) * oneToken) / uint256(Res1));
		}
	}

	/// @notice Calculate how much cost 1 stable token in ELD tokens
	function getStablePrice() public override view returns (uint) {
		//TODO: SECURITY Flash loans, take total deposit in calculation
		(uint112 Res0, uint112 Res1, ) = _dexPairInstance.getReserves();
		uint oneToken = 1 * 10 ** getStableDecimals();
		if (_tokenIs0) {
			return ((uint256(Res0) * oneToken) / uint256(Res1));
		} else {
			return ((uint256(Res1) * oneToken) / uint256(Res0));
		}		
	}

	function isInitialised() public view returns (bool) {
		return _initialised;
	}

	// **************************************************
	// ****************** INTERNAL REGION ***************
	// **************************************************
	function _setDexPairAddress(
		address dexPairAddress_,
		address tokenAddress_
	) internal {
		_dexPairInstance = IUniswapV2Pair(dexPairAddress_);
		_tokenAddress = tokenAddress_;
		if (_dexPairInstance.token0() == tokenAddress_) {
			_stableAddress = _dexPairInstance.token1();
			_tokenIs0 = true;
		} else if (_dexPairInstance.token1() == tokenAddress_) {
			_stableAddress = _dexPairInstance.token0();
			_tokenIs0 = false;
		} else {
			revert("TokenAddress in not in pair!");
		}
	}

	// **************************************************
	// ****************** EVENTS REGION *****************
	// **************************************************
	event DexPairAddressChanged(address oldValue, address newValue);
}
