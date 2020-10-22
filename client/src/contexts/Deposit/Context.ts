import { createContext } from 'react'

import { ContextValues } from './types'

const Context = createContext<ContextValues>({
  onApprove: () => {},
  onHarvest: () => {},
  onRedeem: () => {},
  onDeposit: () => {},
  onWithdraw: () => {},
  onUnstake: () => {},
  allowance: { allowance: undefined }
})

export default Context
