import { useCallback, useState, useEffect } from 'react'

import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  approve,
} from 'flavor-sdk/txUtils'
import useFlavor from 'hooks/useFlavor'
import useDepositAllowance from './useDepositAllowance'

const useDepositApproval = (
  tokenAddress?: string,
  onTxHash?: (txHash: string) => void,
) => {

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const { account, ethereum }: { account: string | null, ethereum?: provider} = useWallet()
  const allowance = useDepositAllowance(tokenAddress);
  const Flavor  = useFlavor()

  const handleApprove = useCallback(async (spenderAddress: string) => {
    if (!ethereum || !account || !spenderAddress || !tokenAddress) {
      return
    }
    allowance.setSpenderAddress(spenderAddress);
    try {
      setIsApproving(true)
      const result = await approve(
        Flavor,
        spenderAddress,
        tokenAddress,
        account,
        onTxHash,
      )
      setIsApproved(result)
      setIsApproving(false)
    } catch (e) {
      setIsApproving(false)
      return false
    }
  }, [
    account,
    ethereum,
    onTxHash,
    setIsApproved,
    setIsApproving,
    tokenAddress,
  ])

  useEffect(() => {
    if (!!allowance.allowance?.toNumber()) {
      setIsApproved(true)
    }
  }, [
    allowance,
    setIsApproved,
  ])

  return {
    isApproved,
    isApproving,
    onApprove: handleApprove,
  }
}

export default useDepositApproval
