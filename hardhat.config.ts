import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";
import "hardhat-deploy";
import "@tenderly/hardhat-tenderly";
import { Wallet, providers } from "ethers";
import "@nomiclabs/hardhat-etherscan";
import path from 'path';

const bip39 = require("bip39");
dotenv.config({ path: __dirname+'/.env' });

const mnemonic = process.env.TEST_MNEMONIC || bip39.generateMnemonic();

let accounts;
let hardhatEvmAccounts;
if (mnemonic) {
  accounts = {
    mnemonic,
  };
  hardhatEvmAccounts = [];
  for (let i = 0; i < 10; i++) {
    const wallet = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + i);
    hardhatEvmAccounts.push({
      privateKey: wallet.privateKey,
      balance: "1000000000000000000000",
    });
  }
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

const goerli =
  process.env.GOERLI ||
  new providers.InfuraProvider("goerli").connection.url;

const fuji =
  process.env.FUJI ||
  new providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  react: {
    providerPriority: ["web3modal", "hardhat"],
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"]
    },
    hardhat: {
      live: false,
      accounts: hardhatEvmAccounts,
      saveDeployments: true,
      tags: ["test", "local"]
    },
    goerli: {
      live: true,
      url: goerli,
      accounts,
      chainId: 5,
      saveDeployments: true,
      tags: ["test"]
    },
    fuji: {
      live: true,
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts,
      chainId: 0xa869,
      saveDeployments: true,
      tags: ["test"]
    },
    stavalanche: {
      live: true,
      url: process.env.STAVALANCHE,
      accounts,
      chainId: 13375,
      saveDeployments: true,
      tags: ["test"]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  }
};
export default config;
