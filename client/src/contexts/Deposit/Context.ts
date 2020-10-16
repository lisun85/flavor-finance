import { createContext } from 'react'

import { ContextValues } from './types'

const Context = createContext<ContextValues>({
  onApprove: () => {},
  onHarvest: () => {},
  onRedeem: () => {},
  onDeposit: () => {},
  onWithdraw: () => {},
  onUnstake: () => {}
})

export default Context
