import BigNumber from 'bignumber.js'

export interface ContextValues {
  assets?: any, // TODO: set type
  fetchAssets: () => void,
  fetchHistory: () => void,
  history?: any, // TODO: set type
}
