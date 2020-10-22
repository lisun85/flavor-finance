import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getAllowance } from 'utils'

const useDepositAllowance = (tokenAddress?: string) => {
  const [allowance, setAllowance] = useState<BigNumber>()
  const [spenderAddress, setSpenderAddress] = useState('')
  const { account, ethereum }: { account: string | null, ethereum?: provider} = useWallet()

  const fetchAllowance = useCallback(async (userAddress: string, provider: provider) => {
    if (!spenderAddress || !tokenAddress || !userAddress) {
      return
    }
    const allowance = await getAllowance(userAddress, spenderAddress, tokenAddress, provider)

    setAllowance(new BigNumber(allowance))
  }, [setAllowance, spenderAddress, tokenAddress])

  useEffect(() => {
    if (account && ethereum && spenderAddress && tokenAddress) {
      fetchAllowance(account, ethereum)
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, ethereum, spenderAddress, tokenAddress])

  return {
    allowance,
    setAllowance,
    setSpenderAddress
  }
}

export default useDepositAllowance
