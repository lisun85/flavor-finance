import BigNumber from 'bignumber.js'

export interface ContextValues {
  countdown?: number,
  earnedBalance?: BigNumber,
  isApproved?: boolean,
  isApproving?: boolean,
  isHarvesting?: boolean,
  isRedeeming?: boolean,
  isStaking?: boolean,
  isDepositing?: boolean,
  isWithdrawing?: boolean,
  isUnstaking?: boolean,
  onApprove: () => void,
  onHarvest: () => void,
  onRedeem: () => void,
  onDeposit: (amount: string, asset: string) => void,
  onWithdraw: (amount: string, asset: string) => void,
  onUnstake: (amount: string) => void,
  stakedBalance?: BigNumber,
}
