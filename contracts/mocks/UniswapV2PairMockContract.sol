// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract UniswapV2PairMockContract {
	address public token0;
	address public token1;
	uint112 public reserve0 = 1 * 10 ** 18;
	uint112 public reserve1 = 1 * 10 ** 18;

	function getReserves() public view returns (uint112, uint112, uint32) {
		return (reserve0, reserve1, 0);
	}

	function setReserves(uint112 res0, uint112 res1) public {
		reserve0 = res0;
		reserve1 = res1;
	}

	function setTokens(address token0_, address token1_) public {
		token0 = token0_;
		token1 = token1_;
	}

	function init(
		address token0_,
		address token1_,
		uint112 res0,
		uint112 res1
	) public {
		setTokens(token0_, token1_);
		setReserves(res0, res1);
	}
}
