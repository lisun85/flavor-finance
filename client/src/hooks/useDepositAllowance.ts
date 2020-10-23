import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getAllowance } from 'utils'

const useDepositAllowance = (tokenAddress: string, setIsApproved: (isApproved) => void) => {
  const [allowance, setAllowance] = useState<BigNumber>()
  const [spenderAddress, _setSpenderAddress] = useState('')
  const { account, ethereum }: { account: string | null, ethereum?: provider} = useWallet()

  const fetchAllowance = useCallback(async (userAddress: string, provider: provider) => {
    if (!spenderAddress || !tokenAddress || !userAddress) {
      return
    }
    const newAllowance = await getAllowance(userAddress, spenderAddress, tokenAddress, provider)

    await setAllowance(new BigNumber(newAllowance))
    await setIsApproved(new BigNumber(newAllowance) > new BigNumber(0))
  }, [setAllowance, spenderAddress, tokenAddress, setIsApproved])

  useEffect(() => {
    if (account && ethereum && spenderAddress && tokenAddress) {
      fetchAllowance(account, ethereum)
    }
  }, [account, ethereum, spenderAddress, tokenAddress])

  const setSpenderAddress = useCallback(async (address: string) => {
    await _setSpenderAddress(address)
    if (account && ethereum && address && tokenAddress) {
      await fetchAllowance(account, ethereum)
    }
  }, [_setSpenderAddress, fetchAllowance, account, ethereum, spenderAddress, tokenAddress, allowance])
  return {
    allowance,
    setAllowance,
    fetchAllowance,
    setSpenderAddress
  }
}

export default useDepositAllowance
