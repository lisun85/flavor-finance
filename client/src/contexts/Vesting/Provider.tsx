import React, { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import useFlavor from 'hooks/useFlavor'
import { 
  claimVested,
  currUnclaimedMigratorVesting,
  currUnclaimedDelegatorRewards,
  currVested,
} from 'flavor-sdk/utils'

import ConfirmTransactionModal from 'components/ConfirmTransactionModal'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const { account } = useWallet()
  const Flavor = useFlavor()

  const [vestedBalance, setVestedBalance] = useState<BigNumber>()
  const [vestedDelegatorRewardBalance, setVestedDelegatorRewardBalance] = useState<BigNumber>()
  const [vestedMigratedBalance, setVestedMigratedBalance] = useState<BigNumber>()

  const [isClaiming, setIsClaiming] = useState(false)
  const [confirmTxModalIsOpen, setConfirmtxModalIsOpen] = useState(false)

  const fetchVestedBalances = useCallback(async () => {
    const vBal = await currVested(Flavor, account)
    const dRVBal = await currUnclaimedDelegatorRewards(Flavor, account)
    const mVBal = await currUnclaimedMigratorVesting(Flavor, account)
    setVestedBalance(vBal)
    setVestedDelegatorRewardBalance(dRVBal)
    setVestedMigratedBalance(mVBal)
  }, [
    account,
    setVestedBalance,
    setVestedDelegatorRewardBalance,
    setVestedMigratedBalance,
    Flavor,
  ])

  const handleClaimTxSent = useCallback(() => {
    setIsClaiming(true)
    setConfirmtxModalIsOpen(false)
  }, [
    setIsClaiming,
    setConfirmtxModalIsOpen
  ])

  const handleClaim = useCallback(async () => {
    setConfirmtxModalIsOpen(true)
    await claimVested(Flavor, account, handleClaimTxSent)
    setIsClaiming(false)
  }, [
    account,
    handleClaimTxSent,
    setConfirmtxModalIsOpen,
    setIsClaiming,
    Flavor
  ])

  useEffect(() => {
    if (account && Flavor) {
      fetchVestedBalances()
    }
  }, [
    account,
    fetchVestedBalances,
    Flavor,
  ])

  useEffect(() => {
    if (account && Flavor) {
      fetchVestedBalances()
      let refreshInterval = setInterval(fetchVestedBalances, 10000)
      return () => clearInterval(refreshInterval)
    }
  }, [
    account,
    Flavor,
    fetchVestedBalances,
  ])

  return (
    <Context.Provider value={{
      onClaim: handleClaim,
      isClaiming,
      vestedBalance,
      vestedDelegatorRewardBalance,
      vestedMigratedBalance,
    }}>
      {children}
      <ConfirmTransactionModal isOpen={confirmTxModalIsOpen} />
    </Context.Provider>
  )
}

export default Provider
