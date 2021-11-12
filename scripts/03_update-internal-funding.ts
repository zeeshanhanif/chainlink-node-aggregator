import { BigNumber } from '@ethersproject/bignumber';
import { ethers, run } from 'hardhat';
import { Median, Median__factory, MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';

async function main() {
  const accounts = await ethers.getSigners();

  const Median:Median__factory = await ethers.getContractFactory("Median");
  const median:Median = await Median.attach("0x899C94BE103fB99C39c055940893e7F89b3d35Fc");

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator",{
    libraries: {
      Median:median.address
    }
  });
  
  const aggregator:MyAggregator = await Aggregator.attach("0xEfD0EA2567cF317a7fC25d5C6512E53de337FF35");
  console.log("Updated Avaiable funds ",(await aggregator.availableFunds()).toString());
  console.log("Allocated funds ",(await aggregator.allocatedFunds()).toString());

  const txt = await aggregator.updateAvailableFunds();
  console.log("UpdateAvailable Funds Transaction = ",txt.hash);
  console.log("Updated Avaiable funds ",(await aggregator.availableFunds()).toString());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
