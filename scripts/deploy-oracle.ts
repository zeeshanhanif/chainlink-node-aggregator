import { BigNumber } from '@ethersproject/bignumber';
import { ethers, run } from 'hardhat';
import { MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';

async function main() {
  const accounts = await ethers.getSigners();
  const linkAddress:string = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  const node1Address:string = "0x36EeADa5b51C54aA07D7E62424DAFA0910f1D368";
  const node2Address:string = "0xc0DC001E854A88aeBdcA7B835157aEbB3279d7Cc";
  
  const Oracle:Oracle__factory = await ethers.getContractFactory("Oracle");
  
  const oracle1:Oracle = await Oracle.deploy(linkAddress);
  await oracle1.deployed();
  
  const oracle2:Oracle = await Oracle.deploy(linkAddress);
  await oracle2.deployed();

  console.log("Oracle 1 deployed to:", oracle1.address);
  console.log("Oracle 2 deployed to:", oracle2.address);
  await oracle1.setFulfillmentPermission(node1Address,true);
  await oracle2.setFulfillmentPermission(node2Address,true);

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator");
  const amount:BigNumber = BigNumber.from("100000000000000000"); // 0.1 link
  const aggregator:MyAggregator = await Aggregator.deploy(linkAddress,amount,500,"0x0000000000000000000000000000000000000000",2,2,18,"Reporting listeners");
  await aggregator.deployed();

  aggregator.changeOracles([],[oracle1.address,oracle2.address],[accounts[0].address,accounts[0].address],2,3,1);
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
