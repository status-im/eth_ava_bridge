import { utils } from "ethers";
const { hexZeroPad, hexlify, keccak256, formatBytes32String } = utils;

export const toHex = (covertThis: any, padding: number) => {
  return hexZeroPad(hexlify(covertThis), padding);
};

export const createResourceID = (contractAddress: string, chainID: number) => {
  const str = chainID.toString() + contractAddress
  return formatBytes32String(str.slice(0, 31));
};
