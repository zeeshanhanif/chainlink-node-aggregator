import { ethers, fundLink, run } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { LinkTokenInterface, LinkTokenInterface__factory, Median, Median__factory, MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';
const hre:HardhatRuntimeEnvironment = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();
  const linkAddress:string = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  
  const Median:Median__factory = await ethers.getContractFactory("Median");
  const median:Median = await Median.attach("0x831884a02fac4F0d6dBFA4C14a7D5834211b7762");

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator",{
    libraries: {
      Median:median.address
    }
  });
  
  const aggregator:MyAggregator = await Aggregator.attach("0xAFE14D93e156CcCBca754d205A9ea925510ff127");

  // Add Fund
  await fundLink(hre,aggregator.address,"1000000000000000000");
  console.log("Funding Added to Aggregator");

  const linkToken = LinkTokenInterface__factory.connect(linkAddress,accounts[0]);
  console.log("link token add ", (await linkToken.balanceOf(aggregator.address)).toString());
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
