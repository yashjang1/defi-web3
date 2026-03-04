import hre from "hardhat";

console.log("HRE keys:", Object.keys(hre));
if (hre.ethers) {
    console.log("ethers found in HRE");
} else {
    console.log("ethers NOT found in HRE");
}
