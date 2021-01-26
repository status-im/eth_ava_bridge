import { ethers,  } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";
import { solidity } from "ethereum-waffle";

import { Bridge } from "../types/Bridge";
import { ERC20Handler } from "../types/ERC20Handler";
import { MintableERC20 } from "../types/MintableERC20";
import {
  createResourceID,
  toWei,
  createERCDepositData,
  generateDepositMetaData
} from "../utils/helpers";

chai.use(solidity);
const { expect  } = chai;

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
  let depositerAddress: string;
  let recipientAddress: string;

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
    await bridge.adminSetResource(
      erc20Handler.address,
      sntEthereumResourceId,
      sntEthereum.address
    );
  });

  it("Should deposit erc20 into the bridge", async function () {
    const [deployer, depositer, recipient] = accounts;
    depositerAddress = await depositer.getAddress();
    recipientAddress = await recipient.getAddress();
    const sntDepositer = sntEthereum.connect(depositer);
    await sntEthereum.mint(depositerAddress, toWei("100"));
    await sntDepositer.approve(erc20Handler.address, toWei("1"));

    const encodedMetaData = generateDepositMetaData(1, recipientAddress);
    const bridgeDepositer = bridge.connect(depositer);
    const deposit = bridgeDepositer.deposit(
      AVA_CHAIN_ID,
      sntEthereumResourceId,
      encodedMetaData
    );
    await expect(deposit)
      .to.emit(bridgeDepositer, 'Deposit');
  });
});
