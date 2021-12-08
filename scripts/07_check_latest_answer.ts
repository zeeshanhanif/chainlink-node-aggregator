import { BigNumber } from '@ethersproject/bignumber';
import { ethers, run } from 'hardhat';
import { Median, Median__factory, MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';

async function main() {
  const accounts = await ethers.getSigners();

  const Median:Median__factory = await ethers.getContractFactory("Median");
  const median:Median = await Median.attach("0x831884a02fac4F0d6dBFA4C14a7D5834211b7762");

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator",{
    libraries: {
      Median:median.address
    }
  });
  
  const aggregator:MyAggregator = await Aggregator.attach("0xAFE14D93e156CcCBca754d205A9ea925510ff127");

  console.log("Aggregator loaded");
  const result = await aggregator.getRoundData(1);
  console.log("Latest Round data = ",result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
