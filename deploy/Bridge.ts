import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { DeployFunction, DeployResult} from 'hardhat-deploy/types';
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Bridge } from "../types/Bridge";
import { ERC20Handler } from "../types/ERC20Handler";
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


const ETHEREUM_CHAIN_ID: number = 1;
const relayerThreshold: number = 1;
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy, execute, read, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const [signer] = await ethers.getSigners();

  const initialRelayers = [deployer];
  let sntEthereum: MintableERC20 = new ethers.Contract(
    SNT_ADDRESS,
    MintableErc20Artifacts.abi,
    signer
  ) as MintableERC20;

  const bridgeDeploy: DeployResult = await deploy("Bridge", {
    from: deployer,
    args: [
      ETHEREUM_CHAIN_ID,
      initialRelayers,
      relayerThreshold,
      0,
      100
    ],
    log: true
  });

  const bridge: Bridge = getContractFromDeploy(bridgeDeploy, signer) as Bridge;
  const sntEthereumResourceId = createResourceID(SNT_ADDRESS, ETHEREUM_CHAIN_ID);
  const erc20HandlerDeploy: DeployResult = await deploy("ERC20Handler", {
    from: deployer,
    args: [
      bridge.address,
      [sntEthereumResourceId],
      [sntEthereum.address],
      []
    ],
    log: true
  });
  const erc20Handler: ERC20Handler = getContractFromDeploy(erc20HandlerDeploy, signer) as ERC20Handler;
  await bridge.adminSetResource(
    erc20Handler.address,
    sntEthereumResourceId,
    sntEthereum.address
  );
};
export default func;
