import { ethers} from 'hardhat';
import { DynamicNFT, DynamicNFT__factory } from '../typechain';

async function main() {
  // Rinkeby
  const accounts = await ethers.getSigners();

  const DynamicNFT:DynamicNFT__factory = await ethers.getContractFactory("DynamicNFT");
  const dynamicNft:DynamicNFT = await DynamicNFT.attach("0xA1fA4D130ec0ff62dC017f14EC237651b6a33DAE");

  //const txt1 = await dynamicNft.requestNFTGeneration("0xcE4452C43390842bE32B45964945276A78985E88","a90ac9049d3b4f5abcb315ff1a3a367a","UCOmHUn--16B90oW2L6FRR3A","channels");
  const txt1 = await dynamicNft.requestNFTGeneration("UCOmHUn--16B90oW2L6FRR3A","channels");
  console.log("Request Send to Generate NFT ",txt1.hash);  
  console.log("Request Send Transaction ",txt1);  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
