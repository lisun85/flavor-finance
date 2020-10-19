import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  usdc as USDCAddress,
  Flavorv3 as FlavorV3Address,
  FlavorTokens as FlavorTokenAddresses,
  yycrvUniLp as yyrcvUniLpAddress,
} from 'constants/tokenAddresses'
import { getBalance } from 'utils'

import Context from './Context'
import { FlavorTokenBalanceValues } from './types'

const Provider: React.FC = ({ children }) => {
  const [FlavorV2Balance, setFlavorV2Balance] = useState<BigNumber>()
  const [FlavorV3Balance, setFlavorV3Balance] = useState<BigNumber>()
  const [USDCBalance, setUSDCBalance] = useState<BigNumber>()
  const [FlavorTokenBalances, setFlavorTokenBalances] = useState<FlavorTokenBalanceValues>({})
  const [yycrvUniLpBalance, setYycrvUniLpBalance] = useState<BigNumber>()

  const { account, ethereum }: { account: string | null, ethereum: provider } = useWallet()

  const fetchBalances = useCallback(async (userAddress: string, provider: provider) => {
    window.console.log('balances', USDCAddress, userAddress, provider);
    const balances = await Promise.all([
      await getBalance(provider, USDCAddress, userAddress),
      await getBalance(provider, FlavorTokenAddresses['BTC'], userAddress),
      await getBalance(provider, FlavorTokenAddresses['ETH'], userAddress),
      await getBalance(provider, FlavorTokenAddresses['LINK'], userAddress),
      //await getBalance(provider, FlavorV3Address, userAddress),
      //await getBalance(provider, yyrcvUniLpAddress, userAddress),

    ])
    setUSDCBalance(new BigNumber(balances[0]).dividedBy(new BigNumber(10).pow(6)))
    setFlavorTokenBalances({
      'BTC': new BigNumber(balances[1]).dividedBy(new BigNumber(10).pow(18)),
      'ETH': new BigNumber(balances[2]).dividedBy(new BigNumber(10).pow(18)),
      'LINK': new BigNumber(balances[3]).dividedBy(new BigNumber(10).pow(18)),
    })
  }, [
    setUSDCBalance,
    setFlavorTokenBalances,
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
      USDCBalance,
      FlavorV3Balance,
      FlavorTokenBalances,
      yycrvUniLpBalance,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider
