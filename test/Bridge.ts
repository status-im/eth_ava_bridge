import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

import { Bridge } from "../types/Bridge"

describe("Bridge", function () {
  let accounts: Signer[];
  let bridge: Bridge;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should deploy bridge contract", async function () {
    let deployerAddress = accounts[0].getAddress();
    const bridgeFactory = await ethers.getContractFactory(
      "Bridge"
    );
    const _bridge = await bridgeFactory.deploy("1", [], "1", "0", "0") as Bridge;
    expect(_bridge).to.have.property('deployTransaction');
    bridge = _bridge;
  });
});
