import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
const {deployments, getNamedAccounts} = require('hardhat');

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // code here
    const { deploy, execute, read, log } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("Bridge", {
        from: deployer,
        args: ["1", [], "1", "0", "0"],
        log: true
    });
};
export default func;

// module.exports = async ({
//     getNamedAccounts,
//     deployments,
//     getChainId,
//     getUnnamedAccounts,
// }) => {
//     const { deploy } = deployments;
//     const { deployer } = await getNamedAccounts();

//     // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment

// };
