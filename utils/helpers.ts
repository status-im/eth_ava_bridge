import { utils } from "ethers";
const {
  hexZeroPad,
  hexlify,
  formatBytes32String,
} = utils;

const AbiCoder = new utils.AbiCoder;
export const toHex = (covertThis: any, padding: number) => {
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
  const addressLength = 20;
  return abiEncode(
  ['uint256', 'uint256', 'bytes'],
  [amount, addressLength, recipientAddress]
  );
}

export const toWei = (x: string) => utils.parseEther(x);

export const createERCDepositData = (
  tokenAmountOrID: number,
  lenRecipientAddress: number,
  recipientAddress: string
): string => {
  return '0x' +
    toHex(tokenAmountOrID, 32).substr(2) +      // Token amount or ID to deposit (32 bytes)
    toHex(lenRecipientAddress, 32).substr(2) + // len(recipientAddress)          (32 bytes)
    recipientAddress.substr(2);               // recipientAddress               (?? bytes)
};
