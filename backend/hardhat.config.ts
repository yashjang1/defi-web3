import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY
        ? process.env.PRIVATE_KEY.includes(' ')
          ? { mnemonic: process.env.PRIVATE_KEY }
          : [process.env.PRIVATE_KEY]
        : [],
      type: "http"
    },
  },
};

export default config;
