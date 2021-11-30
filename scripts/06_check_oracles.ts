import { BigNumber } from '@ethersproject/bignumber';
import { ethers, run } from 'hardhat';
import { Median, Median__factory, MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';

async function main() {
  const accounts = await ethers.getSigners();

  const oracle1Address:string = "0xA8cfFebe4b1cB4Af08e66692f970D6B41a44B95c";
  const oracle2Address:string = "0x1B751D244e37301025012a08Ed8FE98a7362f921";

  const Median:Median__factory = await ethers.getContractFactory("Median");
  const median:Median = await Median.attach("0x831884a02fac4F0d6dBFA4C14a7D5834211b7762");

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator",{
    libraries: {
      Median:median.address
    }
  });
  
  const aggregator:MyAggregator = await Aggregator.attach("0xAFE14D93e156CcCBca754d205A9ea925510ff127");

  const oracleCount = await aggregator.oracleCount();
  for(let i=0;i<oracleCount; i++){
    console.log(`Oracle Address at ${i} index: ${await aggregator.oracleAddresses(i)}`);
  }
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
