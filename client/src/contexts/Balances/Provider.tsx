import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  Flavorv2 as FlavorV2Address,
  Flavorv3 as FlavorV3Address,
  yycrvUniLp as yyrcvUniLpAddress,
} from 'constants/tokenAddresses'
import { getBalance } from 'utils'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const [FlavorV2Balance, setFlavorV2Balance] = useState<BigNumber>()
  const [FlavorV3Balance, setFlavorV3Balance] = useState<BigNumber>()
  const [yycrvUniLpBalance, setYycrvUniLpBalance] = useState<BigNumber>()

  const { account, ethereum }: { account: string | null, ethereum: provider } = useWallet()

  const fetchBalances = useCallback(async (userAddress: string, provider: provider) => {
    const balances = await Promise.all([
      await getBalance(provider, FlavorV2Address, userAddress),
      await getBalance(provider, FlavorV3Address, userAddress),
      await getBalance(provider, yyrcvUniLpAddress, userAddress)
    ])
    setFlavorV2Balance(new BigNumber(balances[0]).dividedBy(new BigNumber(10).pow(24)))
    setFlavorV3Balance(new BigNumber(balances[1]).dividedBy(new BigNumber(10).pow(18)))
    setYycrvUniLpBalance(new BigNumber(balances[2]).dividedBy(new BigNumber(10).pow(18)))
  }, [
    setFlavorV2Balance,
    setFlavorV3Balance,
    setYycrvUniLpBalance
  ])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum)
    }
  }, [
    account,
    ethereum,
    fetchBalances,
  ])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum)
      let refreshInterval = setInterval(() => fetchBalances(account, ethereum), 10000)
      return () => clearInterval(refreshInterval)
    }
  }, [
    account,
    ethereum,
    fetchBalances,
  ])

  return (
    <Context.Provider value={{
      FlavorV2Balance,
      FlavorV3Balance,
      yycrvUniLpBalance,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider