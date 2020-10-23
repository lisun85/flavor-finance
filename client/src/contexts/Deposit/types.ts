import BigNumber from 'bignumber.js'

export interface ContextValues {
  countdown?: number,
  earnedBalance?: BigNumber,
  allowance?: any,
  isApproved?: boolean,
  isApproving?: boolean,
  setIsApproved?: (val: boolean) => void,
  isHarvesting?: boolean,
  isRedeeming?: boolean,
  isStaking?: boolean,
  isDepositing?: boolean,
  isWithdrawing?: boolean,
  isUnstaking?: boolean,
  onApprove: () => void,
  onHarvest: () => void,
  onRedeem: () => void,
  onDeposit: (amount: string, asset: string, fetchBalances: () => void) => void,
  onWithdraw: (amount: string, asset: string, fetchBalances: () => void) => void,
  onUnstake: (amount: string) => void,
  stakedBalance?: BigNumber,
}
