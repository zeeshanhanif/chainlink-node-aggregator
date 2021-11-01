//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Aggregator is AggregatorV2V3Interface, Ownable {
}