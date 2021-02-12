import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import chai from "chai";
import { solidity } from "ethereum-waffle";

import { Bridge } from "../types/Bridge";
import { ERC20Handler } from "../types/ERC20Handler";
import { MintableERC20 } from "../types/MintableERC20";
import { ERC20Safe } from "../types/ERC20Safe";
import { ERC20PresetMinterPauser } from "../types/ERC20PresetMinterPauser";
import {
  createResourceID,
  toWei,
  generateDepositMetaData,
  generateDepositDataHash,
  createERCDepositData,
} from "../utils/helpers";

chai.use(solidity);
const { expect  } = chai;

describe("Bridge", function () {
  const ETHEREUM_CHAIN_ID: number = 1;
  const AVA_CHAIN_ID: number = 2;
  const relayerThreshold: number = 2;
  let accounts: Signer[];
  let EthereumBridge: Bridge;
  let AvalancheBridge: Bridge;
  let ethereumErc20Handler: ERC20Handler;
  let avalancheErc20Handler: ERC20Handler;
  let sntEthereum: MintableERC20;
  let sntEthereumResourceId: string;
  let sntAvalanche: ERC20PresetMinterPauser;
  let sntAvalancheResourceId: string;
  let deployerAddress: string;
  let depositerAddress: string;
  let recipientAddress: string;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should deploy bridge contracts", async function () {
    const [deployer, depositer, recipient, relayer1, relayer2] = accounts;
    const initialRelayers = [await relayer1.getAddress(), await relayer2.getAddress()];
    deployerAddress = await accounts[0].getAddress();
    const bridgeFactory = await ethers.getContractFactory("Bridge");
    const _EthereumBridge = await bridgeFactory.deploy(
      ETHEREUM_CHAIN_ID,
      initialRelayers,
      relayerThreshold,
      0,
      100
    ) as Bridge;
    const _AvalancheBridge = await bridgeFactory.deploy(
      AVA_CHAIN_ID,
      initialRelayers,
      relayerThreshold,
      0,
      100
    ) as Bridge;
    expect(_EthereumBridge).to.have.property('deployTransaction');
    expect(_AvalancheBridge).to.have.property('deployTransaction');
    EthereumBridge = _EthereumBridge;
    AvalancheBridge = _AvalancheBridge;
  });

  it("Should create erc20 handler", async function () {
    const erc20Factory = await ethers.getContractFactory("MintableERC20");
    const safeErc20Factory = await ethers.getContractFactory("ERC20PresetMinterPauser");
    const _snt = await erc20Factory.deploy("SNT", "SNT") as MintableERC20;
    const _sntAvalanche = await safeErc20Factory.deploy("SNT", "SNT") as ERC20PresetMinterPauser;
    sntEthereum = _snt;
    sntAvalanche = _sntAvalanche;
    sntEthereumResourceId = createResourceID(sntEthereum.address, ETHEREUM_CHAIN_ID);
    sntAvalancheResourceId = createResourceID(sntAvalanche.address, AVA_CHAIN_ID);
    const erc20HandlerFactory = await ethers.getContractFactory("ERC20Handler");
    const _ethereumErc20Handler = await erc20HandlerFactory.deploy(
      EthereumBridge.address,
      [sntEthereumResourceId],
      [sntEthereum.address],
      []
    ) as ERC20Handler;
    const _avalancheErc20Handler = await erc20HandlerFactory.deploy(
      AvalancheBridge.address,
      [sntAvalancheResourceId],
      [sntAvalanche.address],
      [sntAvalanche.address]
    ) as ERC20Handler;
    ethereumErc20Handler = _ethereumErc20Handler;
    avalancheErc20Handler = _avalancheErc20Handler;
    await EthereumBridge.adminSetResource(
      ethereumErc20Handler.address,
      sntEthereumResourceId,
      sntEthereum.address
    );
    await AvalancheBridge.adminSetResource(
      avalancheErc20Handler.address,
      sntAvalancheResourceId,
      sntAvalanche.address
    );
    await sntAvalanche.grantRole(await sntAvalanche.MINTER_ROLE(), avalancheErc20Handler.address);
    await AvalancheBridge.adminSetResource(avalancheErc20Handler.address, sntAvalancheResourceId, sntAvalanche.address);
  });

  let depositNonce: BigNumber;
  let encodedMetaData: string;
  it("Should deposit SNT into the Ethereum bridge", async function () {
    const [deployer, depositer, recipient] = accounts;
    depositerAddress = await depositer.getAddress();
    recipientAddress = await recipient.getAddress();
    const sntDepositer = sntEthereum.connect(depositer);
    await sntEthereum.mint(depositerAddress, toWei("100"));
    await sntDepositer.approve(ethereumErc20Handler.address, toWei("1"));

    encodedMetaData = createERCDepositData(toWei('1'), recipientAddress);
    const bridgeDepositer = EthereumBridge.connect(depositer);
    const deposit = await bridgeDepositer.deposit(
      AVA_CHAIN_ID,
      sntEthereumResourceId,
      encodedMetaData
    );
    const receipt = await deposit.wait(1);
    const events = receipt.events;
    const depositEvent = events?.find(x => x.event == 'Deposit');
    depositNonce = depositEvent?.args?.depositNonce
    expect(depositNonce).to.eq(1)
  });

  it("Should execute deposit on destination bridge", async function () {
    const [deployer, depositer, recipient, relayer1, relayer2] = accounts;
    const bridgeRelayer1: Bridge = AvalancheBridge.connect(relayer1);
    const bridgeRelayer2: Bridge = AvalancheBridge.connect(relayer2);
    const depositDataHash = generateDepositDataHash(avalancheErc20Handler.address, encodedMetaData);
    const pre = await sntAvalanche.balanceOf(await recipient.getAddress());
    const relay1Vote = await bridgeRelayer1.voteProposal(
      ETHEREUM_CHAIN_ID,
      depositNonce,
      sntAvalancheResourceId,
      depositDataHash
    );
    const relay2Vote = await bridgeRelayer2.voteProposal(
      ETHEREUM_CHAIN_ID,
      depositNonce,
      sntAvalancheResourceId,
      depositDataHash
    );
    const executeProposal = await bridgeRelayer2.executeProposal(
      ETHEREUM_CHAIN_ID,
      depositNonce,
      encodedMetaData,
      sntAvalancheResourceId
    );
    const post = await sntAvalanche.balanceOf(await recipient.getAddress());
    expect(pre).to.eq(0);
    expect(post).to.eq(toWei('1'));
  })
});
