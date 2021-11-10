import { BigNumber } from '@ethersproject/bignumber';
import { ethers, run } from 'hardhat';
import { Median, Median__factory, MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';

async function main() {
  const accounts = await ethers.getSigners();

  const Median:Median__factory = await ethers.getContractFactory("Median");
  const median:Median = await Median.attach("0xfA11EDfCaB1C093A489650076be689953eb35670");

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator",{
    libraries: {
      Median:median.address
    }
  });
  
  const aggregator:MyAggregator = await Aggregator.attach("0xbeD8c7C6c33B9760aE6Df7936e74b88aE4D93504");
  console.log("Updated Avaiable funds ",(await aggregator.availableFunds()).toString());
  console.log("Allocated funds ",(await aggregator.allocatedFunds()).toString());

  await aggregator.updateAvailableFunds();

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
