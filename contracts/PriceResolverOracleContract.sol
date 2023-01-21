// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./PriceResolverContract.sol";

contract PriceResolverOracleContract is PriceResolverContract {
	bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

	bool private _initialised;

	// **************************************************
	// *************** DEFAULT_ADMIN REGION *************
	// **************************************************
	function init(
		address defaultAdminAddress_,
		address moderatorAddress_,
		address tokenAddress_,
		address stableAddress_
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		require(!_initialised, "Contract is already initialised!");

		_grantRole(DEFAULT_ADMIN_ROLE, defaultAdminAddress_);
		_grantRole(MODERATOR_ROLE, moderatorAddress_);

        _tokenAddress = tokenAddress_;
		_stableAddress = stableAddress_;

		_initialised = true;
		_revokeRole(DEFAULT_ADMIN_ROLE, _msgSender());
	}

	// **************************************************
	// ***************** MODERATOR REGION ***************
	// **************************************************
	function setTokenPrice(uint256 tokenPrice_) public onlyRole(MODERATOR_ROLE) {		
		_setTokenPrice(tokenPrice_);
	}

    function setStablePrice(uint256 stablePrice_) public onlyRole(MODERATOR_ROLE) {
        _setStablePrice(stablePrice_);
    }

	function setPrice(uint256 tokenPrice_, uint256 stablePrice_) public onlyRole(MODERATOR_ROLE) {
		_setPrice(tokenPrice_, stablePrice_);
	}
	// **************************************************
	// ************** PUBLIC GETTERS REGION *************
	// **************************************************	
	function isInitialised() public view returns (bool) {
		return _initialised;
	}	
}
