// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

abstract contract PriceResolverContract is AccessControlEnumerable {
	address internal _tokenAddress;
	address internal _stableAddress;
	uint256 private _tokenPrice; // How much cost 1 ELD token in stable tokens
	uint256 private _stablePrice; // How much cost 1 stable token in ELD tokens

	// **************************************************
	// *************** DEFAULT_ADMIN REGION *************
	// **************************************************
	function salvageTokensFromContract(
		address tokenAddress_,
		address to_,
		uint amount_
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		IERC20(tokenAddress_).transfer(to_, amount_);
		emit TokensSalvaged(tokenAddress_, to_, amount_);
	}

	function killContract() public onlyRole(DEFAULT_ADMIN_ROLE) {
		emit ContractKilled();
		selfdestruct(payable(_msgSender()));
	}

	// **************************************************
	// ************** PUBLIC GETTERS REGION *************
	// **************************************************
	function getTokenAddress() public view returns (address) {
		return _tokenAddress;
	}

	function getTokenDecimals() public view returns (uint8) {
		return IERC20Metadata(_tokenAddress).decimals();
	}

	function getStableAddress() public view returns (address) {
		return _stableAddress;
	}

	function getStableDecimals() public view returns (uint8) {
		return IERC20Metadata(_stableAddress).decimals();
	}

	/// @notice Calculate how much cost 1 ELD token in stable tokens
	function getTokenPrice() public view virtual returns (uint256) {
		return _tokenPrice;
	}

	/// @notice Calculate how much cost 1 stable token in ELD tokens
	function getStablePrice() public view virtual returns (uint256) {
		return _stablePrice;	
	}

	// **************************************************
	// ****************** INTERNAL REGION ***************
	// **************************************************
	function _setTokenPrice(uint256 tokenPrice_) internal {
		emit TokenPriceUpdated(_tokenPrice, tokenPrice_);
		_tokenPrice = tokenPrice_;
	}

	function _setStablePrice(uint256 stablePrice_) internal {
		emit StablePriceUpdated(_stablePrice, stablePrice_);
		_stablePrice = stablePrice_;
	}

	function _setPrice(uint256 tokenPrice_, uint256 stablePrice_) internal {
		_setTokenPrice(tokenPrice_);
		_setStablePrice(stablePrice_);
	}

	// **************************************************
	// ****************** EVENTS REGION *****************
	// **************************************************
	event TokensSalvaged(address indexed tokenAddress, address indexed userAddress, uint amount);
	event ContractKilled();
	event TokenPriceUpdated(uint256 oldValue, uint256 newValue);
	event StablePriceUpdated(uint256 oldValue, uint256 newValue);
}
