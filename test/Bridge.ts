import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

import { Bridge } from "../types/Bridge"
import { ERC20Handler } from "../types/ERC20Handler"
import { MintableERC20 } from "../types/MintableERC20"
import { createResourceID } from "../utils/helpers"

describe("Bridge", function () {
  const ETHEREUM_CHAIN_ID: number = 1;
  const AVA_CHAIN_ID: number = 2;
  const relayerThreshold: number = 0;
  let accounts: Signer[];
  let bridge: Bridge;
  let erc20Handler: ERC20Handler;
  let sntEthereum: MintableERC20;
  let sntEthereumResourceId: string;
  let deployerAddress: string;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should deploy bridge contract", async function () {
    deployerAddress = await accounts[0].getAddress();
    const bridgeFactory = await ethers.getContractFactory("Bridge");
    const _bridge = await bridgeFactory.deploy(ETHEREUM_CHAIN_ID, [], relayerThreshold, 0, 100) as Bridge;
    expect(_bridge).to.have.property('deployTransaction');
    bridge = _bridge;
  });

  it("Should create erc20 handler", async function () {
    const erc20Factory = await ethers.getContractFactory("MintableERC20");
    const _snt = await erc20Factory.deploy("SNT", "SNT") as MintableERC20;
    sntEthereum = _snt;
    sntEthereumResourceId = createResourceID(sntEthereum.address, ETHEREUM_CHAIN_ID);
    const erc20HandlerFactory = await ethers.getContractFactory("ERC20Handler");
    const _erc20Handler = await erc20HandlerFactory.deploy(
      bridge.address,
      [sntEthereumResourceId],
      [sntEthereum.address],
      []
    ) as ERC20Handler;
    erc20Handler = _erc20Handler;
  });

  it("Should deposit erc20 in bridge", async function () {});
});
