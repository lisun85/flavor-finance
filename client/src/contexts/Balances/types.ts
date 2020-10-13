import BigNumber from 'bignumber.js'

export interface FlavorTokenBalanceValues {
  [key: string]: BigNumber
}
export interface ContextValues {
  FlavorV2Balance?: BigNumber,
  FlavorV3Balance?: BigNumber,
  USDCBalance?: BigNumber,
  FlavorTokenBalances?: FlavorTokenBalanceValues,
  yycrvUniLpBalance?: BigNumber
}
