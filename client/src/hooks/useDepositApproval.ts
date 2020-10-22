import { useCallback, useState, useEffect } from 'react'

import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  approve,
} from 'flavor-sdk/txUtils'
import useFlavor from 'hooks/useFlavor'

const useDepositApproval = (
  tokenAddress?: string,
  onTxHash?: (txHash: string) => void,
) => {

  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const { account, ethereum }: { account: string | null, ethereum?: provider} = useWallet()

  const Flavor  = useFlavor()

  const handleApprove = useCallback(async (spenderAddress: string) => {
    if (!ethereum || !account || !spenderAddress || !tokenAddress) {
      return
    }
    try {
      setIsApproving(true)
      return await approve(
        Flavor,
        spenderAddress,
        tokenAddress,
        account,
        onTxHash,
        error => {
          setIsApproving(false)
          if (!error){
          setIsApproved(true)
          }
        }
      )

    } catch (e) {
      setIsApproving(false)
      return false
    }
  }, [
    account,
    ethereum,
    onTxHash,
    isApproved,
    setIsApproved,
    setIsApproving,
    tokenAddress,
  ])

  return {
    isApproved,
    setIsApproved,
    isApproving,
    onApprove: handleApprove,
  }
}

export default useDepositApproval
