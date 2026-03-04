import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployModule", (m) => {
    const tokenA = m.contract("Token", ["Token A", "A", 1000000], { id: "TokenA" });
    const tokenB = m.contract("Token", ["Token B", "B", 1000000], { id: "TokenB" });

    const amm = m.contract("SimpleAMM", [tokenA, tokenB]);

    // Ensure tokens are deployed before adding liquidity
    // m.call(tokenA, "approve", [amm, 100000n * 10n**18n]);
    // m.call(tokenB, "approve", [amm, 100000n * 10n**18n]);
    // m.call(amm, "addLiquidity", [10000n * 10n**18n, 10000n * 10n**18n], { after: [tokenA, tokenB, amm]});

    return { tokenA, tokenB, amm };
});
