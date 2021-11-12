import { ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DynamicNFT, DynamicNFT__factory } from '../typechain';

async function main() {
  const accounts = await ethers.getSigners();
  
  const DynamicNFT:DynamicNFT__factory = await ethers.getContractFactory("DynamicNFT");
  
  const dynamicNft:DynamicNFT = await DynamicNFT.deploy();
  await dynamicNft.deployed();
  
  console.log("DynamicNFT deployed to:", dynamicNft.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
