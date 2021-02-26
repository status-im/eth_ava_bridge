const addresses: Record<string,string> = {
  'FUJI': '0xB4042F60Be43605B2A1e01eEE6cA757d7161217C',
  'STAVALANCHE': '0xe642a32578abdA8b7e30820cC24972eDCc97f63F'
}
const network: string = process.env.REACT_APP_AVALANCHE_NET || '';
export const SNT_ADDRESS = addresses[network];
