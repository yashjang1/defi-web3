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

    function swapAforB(uint amountA) public {
        uint amountB = (amountA * 98) / 100;
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "Transfer A failed");
        require(tokenB.transfer(msg.sender, amountB), "Transfer B failed");
    }

    function swapBforA(uint amountB) public {
        uint amountA = (amountB * 100) / 98;
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "Transfer B failed");
        require(tokenA.transfer(msg.sender, amountA), "Transfer A failed");
    }
}