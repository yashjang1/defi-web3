// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    constructor() ERC20("College Token A", "CTA") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint() public {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}