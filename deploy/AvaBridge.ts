import { Signer, BigNumber } from "ethers";
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { DeployFunction, DeployResult} from 'hardhat-deploy/types';
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Bridge } from "../types/Bridge";
import { ERC20Handler } from "../types/ERC20Handler";
import { ERC20PresetMinterPauser } from "../types/ERC20PresetMinterPauser";
import { MintableERC20 } from "../types/MintableERC20";
import {
  createResourceID,
  toWei,
  generateDepositMetaData,
  generateDepositDataHash,
  createERCDepositData,
} from "../utils/helpers";
import { getContractFromDeploy } from "../utils/deploy"
import { SNT_ADDRESS } from "../constants/goerliAddress";
import MintableErc20Artifacts from "../artifacts/contracts/tokens/MintableErc20.sol/MintableERC20.json";
import { util } from "chai";


const ETHEREUM_CHAIN_ID: number = 1;
const AVA_CHAIN_ID: number = 2;
const relayerThreshold: number = 1;
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy, execute, read, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const signers: Signer[] = await ethers.getSigners();
  const [signer] = signers;
  const signerAddress = await signer.getAddress();
  console.log({signerAddress})

  const initialRelayers = [deployer];
  let sntAvalancheDeploy: DeployResult = await deploy("ERC20PresetMinterPauser", {
    from: deployer,
    args: ["SNT", "SNT"],
    log: true,
  });

  const bridgeDeploy: DeployResult = await deploy("Bridge", {
    from: deployer,
    args: [
      AVA_CHAIN_ID,
      initialRelayers,
      relayerThreshold,
      0,
      100
    ],
    log: true,
  });

  const bridge: Bridge = getContractFromDeploy(bridgeDeploy, signer) as Bridge;
  const sntAvalanche = getContractFromDeploy(sntAvalancheDeploy, signer) as ERC20PresetMinterPauser;
  const sntAvalancheResourceId = createResourceID(sntAvalanche.address, AVA_CHAIN_ID);
  const erc20HandlerDeploy: DeployResult = await deploy("ERC20Handler", {
    from: deployer,
    args: [
      bridge.address,
      [sntAvalancheResourceId],
      [sntAvalanche.address],
      [sntAvalanche.address]
    ],
    log: true,
  });
  const erc20Handler: ERC20Handler = getContractFromDeploy(erc20HandlerDeploy, signer) as ERC20Handler;
  await bridge.adminSetResource(
    erc20Handler.address,
    sntAvalancheResourceId,
    sntAvalanche.address
  );
  await sntAvalanche.grantRole(await sntAvalanche.MINTER_ROLE(), erc20Handler.address);
  await bridge.adminSetResource(erc20Handler.address, sntAvalancheResourceId, sntAvalanche.address);
};
func.tags = ["avalanche"];
export default func;
