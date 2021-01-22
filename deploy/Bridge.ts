import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
const {deployments, getNamedAccounts} = require('hardhat');

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy, execute, read, log } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("Bridge", {
        from: deployer,
        args: ["1", [], "1", "0", "0"],
        log: true
    });
};
export default func;
