import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const pk = process.env.PRIVATE_KEY;
    const provider = new ethers.JsonRpcProvider(rpcUrl.replace(/'/g, ""));
    const signer = new ethers.Wallet(pk.includes(' ') ? ethers.Wallet.fromPhrase(pk).privateKey : pk, provider);

    const tokenA = "0x3852Cf99b298c7Be710bC08c93b37ce921561f8A";
    const abi = ["function mint() public"];
    const contract = new ethers.Contract(tokenA, abi, signer);

    console.log("Calling mint()");
    const tx = await contract.mint();
    console.log("Tx hash:", tx.hash);
    await tx.wait();
    console.log("Mint successful!");
}

main().catch(console.error);
