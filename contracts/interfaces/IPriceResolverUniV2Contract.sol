// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
interface IPriceResolverUniV2Contract {
  function DEFAULT_ADMIN_ROLE (  ) external view returns ( bytes32 );
  function MODERATOR_ROLE (  ) external view returns ( bytes32 );
  function getDexPairAddress (  ) external view returns ( address );
  function getRoleAdmin ( bytes32 role ) external view returns ( bytes32 );
  function getRoleMember ( bytes32 role, uint256 index ) external view returns ( address );
  function getRoleMemberCount ( bytes32 role ) external view returns ( uint256 );
  function getStableAddress (  ) external view returns ( address );
  function getStableDecimals (  ) external view returns ( uint256 );
  function getStablePrice (  ) external view returns ( uint256 );
  function getTokenAddress (  ) external view returns ( address );
  function getTokenDecimals (  ) external view returns ( uint256 );
  function getTokenPrice (  ) external view returns ( uint256 );
  function grantRole ( bytes32 role, address account ) external;
  function hasRole ( bytes32 role, address account ) external view returns ( bool );
  function init ( address defaultAdminAddress_, address moderatorAddress_, address tokenAddress_, address dexPairAddress_ ) external;
  function isInitialised (  ) external view returns ( bool );
  function killContract (  ) external;
  function renounceRole ( bytes32 role, address account ) external;
  function revokeRole ( bytes32 role, address account ) external;
  function salvageTokensFromContract ( address tokenAddress_, address to_, uint256 amount_ ) external;
  function setDexPairAddress ( address dexPairAddress_, address tokenAddress_ ) external;
  function supportsInterface ( bytes4 interfaceId ) external view returns ( bool );
}
