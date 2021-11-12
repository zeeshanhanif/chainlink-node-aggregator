import { ethers, fundLink } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DynamicNFT, DynamicNFT__factory, LinkTokenInterface__factory } from '../typechain';
const hre:HardhatRuntimeEnvironment = require("hardhat");

async function main() {
  // Kovan
  const accounts = await ethers.getSigners();
  const linkAddress:string = "0xa36085F69e2889c224210F603D836748e7dC0088";
  
  const DynamicNFT:DynamicNFT__factory = await ethers.getContractFactory("DynamicNFT");
  const dynamicNft:DynamicNFT = await DynamicNFT.attach("0x77d6633fe2f09d765A133d5634680193af978A86");

  await fundLink(hre,dynamicNft.address,"1000000000000000000"); // 1 Links
  console.log("Funding Added to DynamicNFT");

  const linkToken = LinkTokenInterface__factory.connect(linkAddress,accounts[0]);
  console.log("link token add ", (await linkToken.balanceOf(dynamicNft.address)).toString());
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
