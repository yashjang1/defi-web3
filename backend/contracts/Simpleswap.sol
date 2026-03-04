// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleSwap {

    IERC20 public tokenA;
    IERC20 public tokenB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function swapAforB(uint amount) public {
        tokenA.transferFrom(msg.sender, address(this), amount);
        tokenB.transfer(msg.sender, amount);
    }

    function swapBforA(uint amount) public {
        tokenB.transferFrom(msg.sender, address(this), amount);
        tokenA.transfer(msg.sender, amount);
    }
}