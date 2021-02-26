const avalancheAddresses: Record<string,string> = {
  'FUJI': '0x5055f5Ef1dF13f1018BA5e203545127Ec44523aD',
  'STAVALANCHE': '0x29D3E689F0E0bc48E0ef8429993201258c57587b'
}
const avalancheSNTHandlers: Record<string,string> = {
  'FUJI': '0xCaBBA5cE36305FD615C77e9CF202Fd09Bc79ad03',
  'STAVALANCHE': '0xa93b811D1B75C62fDA0d843e91322B74D8901a0D'
}
const network: string = process.env.REACT_APP_AVALANCHE_NET || '';
export const ethereumAddress = '0xD0E461b1Dc56503fC72565FA964C28E274146D44';
export const ethereumSNTHandlerAddress = '0xf41938b2464B908D5C10287bbfBE69dd368DaC3a';
export const avalancheAddress = avalancheAddresses[network];
export const avalancheSNTHandlerAddress = avalancheSNTHandlers[network];
