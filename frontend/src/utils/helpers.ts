import { Address } from "cluster";
import { BigNumberish, BytesLike, utils } from "ethers";
const {
  hexZeroPad,
  hexlify,
  formatBytes32String,
  keccak256,
  formatEther
} = utils;

export const fromWei = (x: BigNumberish) => Number(formatEther(x));
const AbiCoder = new utils.AbiCoder;
export const toHex = (covertThis: any, padding: any) => {
  return hexZeroPad(hexlify(covertThis), padding);
};

export const createResourceID = (contractAddress: string, chainID: number) => {
  const str = chainID.toString() + contractAddress
  return formatBytes32String(str.slice(0, 31));
};

export const abiEncode = (valueTypes: any[], values: any[]) => {
  return AbiCoder.encode(valueTypes, values)
};

export const generateDepositMetaData = (amount: number, recipientAddress: string) => {
  console.log({recipientAddress})
  const addressLength = 20;
  return abiEncode(
    ['uint256', 'uint256', 'bytes'],
    [1, addressLength, recipientAddress]
  );
}

export const toWei = (x: string) => utils.parseEther(x);

export const createERCDepositData = (
  tokenAmountOrID: BigNumberish,
  recipientAddress: string
): string => {
  const lenRecipientAddress = 20;
  return '0x' +
    toHex(tokenAmountOrID, 32).substr(2) +      // Token amount or ID to deposit (32 bytes)
    toHex(lenRecipientAddress, 32).substr(2) + // len(recipientAddress)          (32 bytes)
    recipientAddress.substr(2);               // recipientAddress               (?? bytes)
};

export const generateDepositDataHash = (handler: string, depositData: string): BytesLike => keccak256(handler + depositData.substr(2));
