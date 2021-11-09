import { BigNumber } from '@ethersproject/bignumber';
import { ethers, fundLink, run } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { LinkTokenInterface, Median, Median__factory, MyAggregator, MyAggregator__factory, Oracle, Oracle__factory } from '../typechain';
const hre:HardhatRuntimeEnvironment = require("hardhat");

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

  const Median:Median__factory = await ethers.getContractFactory("Median");
  const median:Median = await Median.deploy();

  console.log("Median Library address: ",median.address);

  const Aggregator:MyAggregator__factory = await ethers.getContractFactory("MyAggregator",{
    libraries: {
      Median:median.address
    }
  });
  // 0.1 link will be paid to each orcale when the submit result in each round
  const amount:BigNumber = BigNumber.from("100000000000000000"); // 0.1 link
  const aggregator:MyAggregator = await Aggregator.deploy(linkAddress,amount,500,"0x0000000000000000000000000000000000000000",0,10000,18,"Reporting listeners");
  await aggregator.deployed();
  console.log("Aggregator deployed to:", aggregator.address);

  
  //const txt = await aggregator.changeOracles([],[oracle1.address,oracle2.address],[accounts[0].address,accounts[0].address],1,1,1);
  //console.log("changeOracles called :", txt.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
