import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("🚀 Starting deployment on Sepolia with custom contracts...");

  // 1. Setup Provider & Signer
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const pk = process.env.PRIVATE_KEY;

  if (!rpcUrl || !pk) {
    throw new Error("❌ Missing SEPOLIA_RPC_URL or PRIVATE_KEY in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl.replace(/'/g, ""));
  let signer;

  if (pk.includes(' ')) {
    signer = ethers.Wallet.fromPhrase(pk).connect(provider);
  } else {
    signer = new ethers.Wallet(pk, provider);
  }

  const deployerAddress = await signer.getAddress();
  console.log("📡 Deploying with address:", deployerAddress);

  const balance = await provider.getBalance(deployerAddress);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  // 2. Load Artifacts
  console.log("📦 Loading artifacts [TokenA, TokenB, SimpleSwap]...");
  const artA = await hre.artifacts.readArtifact("TokenA");
  const artB = await hre.artifacts.readArtifact("TokenB");
  const artSwap = await hre.artifacts.readArtifact("SimpleSwap");

  const FactA = new ethers.ContractFactory(artA.abi, artA.bytecode, signer);
  const FactB = new ethers.ContractFactory(artB.abi, artB.bytecode, signer);
  const FactSwap = new ethers.ContractFactory(artSwap.abi, artSwap.bytecode, signer);

  // 3. Deploy Token A
  console.log("⛏️ Deploying Token A...");
  const tokenA = await FactA.deploy();
  await tokenA.waitForDeployment();
  const addrA = await tokenA.getAddress();
  console.log("✅ Token A at:", addrA);

  // 4. Deploy Token B
  console.log("⛏️ Deploying Token B...");
  const tokenB = await FactB.deploy();
  await tokenB.waitForDeployment();
  const addrB = await tokenB.getAddress();
  console.log("✅ Token B at:", addrB);

  // 5. Deploy SimpleSwap
  console.log("⛏️ Deploying SimpleSwap...");
  const swap = await FactSwap.deploy(addrA, addrB);
  await swap.waitForDeployment();
  const addrSwap = await swap.getAddress();
  console.log("✅ SimpleSwap at:", addrSwap);

  // 6. Fund the Swap Contract
  // Since SimpleSwap requires tokens to be available in the contract for swapping
  console.log("💧 Funding Swap contract with some liquidity...");
  const fundAmount = ethers.parseUnits("10000", 18);

  console.log("  Sending Token A...");
  const tx1 = await tokenA.transfer(addrSwap, fundAmount);
  await tx1.wait();

  console.log("  Sending Token B...");
  const tx2 = await tokenB.transfer(addrSwap, fundAmount);
  await tx2.wait();
  console.log("✅ Swap contract funded!");

  // 7. Update Frontend
  const contractsPath = path.join(process.cwd(), "..", "frontend", "src", "contracts.json");
  console.log("📝 Updating frontend/src/contracts.json...");

  const contractInfo = {
    TokenA: addrA,
    TokenB: addrB,
    SimpleAMM: addrSwap // Use swap address for AMM field
  };

  fs.writeFileSync(contractsPath, JSON.stringify(contractInfo, null, 2));
  console.log("🎉 SUCCESS! Project is live.");
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});