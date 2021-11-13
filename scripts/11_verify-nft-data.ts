import { ethers} from 'hardhat';
import { DynamicNFT, DynamicNFT__factory } from '../typechain';

async function main() {
  // Kovan
  const accounts = await ethers.getSigners();

  const DynamicNFT:DynamicNFT__factory = await ethers.getContractFactory("DynamicNFT");
  const dynamicNft:DynamicNFT = await DynamicNFT.attach("0xA1fA4D130ec0ff62dC017f14EC237651b6a33DAE");

  const result = await dynamicNft.apidata(0);
  console.log("API Data at 0 ",result);

  const listeners = await dynamicNft.totalListeners();
  console.log("Listeners ",listeners);
  console.log("Listeners ",listeners.toString());

  const counter = await dynamicNft.getNumberOfAPIData();
  console.log("NumberOfAPIData ",counter.toString());

  const apiOverView = await dynamicNft.getAPIOverView(0);
  console.log("apiOverView ",apiOverView);

  const apiOverViewStruct = await dynamicNft.getAPIOverViewStruct(0);
  console.log("apiOverViewStruct ",apiOverViewStruct);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
