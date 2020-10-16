import React, { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import ConfirmTransactionModal from 'components/ConfirmTransactionModal'
import useDepositApproval from 'hooks/useDepositApproval'
import useFlavor from 'hooks/useFlavor'

import {
  getEarned,
  getStaked,
  harvest,
  redeem,
  stake,
  unstake,
} from 'flavor-sdk/utils'
import {
  usdc as USDCAddress,
  FlavorTokens as FlavorTokenAddresses,
} from 'constants/tokenAddresses'
import {
  deposit,
  withdraw
} from 'flavor-sdk/txUtils'

import Context from './Context'

const farmingStartTime = 1600545500*1000

const Provider: React.FC = ({ children }) => {
  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false)
  const [countdown, setCountdown] = useState<number>()
  const [isHarvesting, setIsHarvesting] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)

  const [earnedBalance, setEarnedBalance] = useState<BigNumber>()
  const [stakedBalance, setStakedBalance] = useState<BigNumber>()

  const Flavor  = useFlavor()
  const { account } = useWallet()

  // TODO: REPLACE THESE
  const flavorUniLpAddress = '';
  const flavorPoolAddress = '';//Flavor ? Flavor.contracts.flavor_pool.options.address : ''
  const { isApproved, isApproving, onApprove } = useDepositApproval(
    USDCAddress,
    () => setConfirmTxModalIsOpen(false)
  )

  const fetchEarnedBalance = useCallback(async () => {
    if (!account || !Flavor) return
    const balance = await getEarned(Flavor, flavorPoolAddress, account)
    setEarnedBalance(balance)
  }, [
    account,
    setEarnedBalance,
    Flavor
  ])

  const fetchStakedBalance = useCallback(async () => {
    if (!account || !Flavor) return
    const balance = await getStaked(Flavor, flavorPoolAddress, account)
    setStakedBalance(balance)
  }, [
    account,
    setStakedBalance,
    Flavor
  ])

  const fetchBalances = useCallback(async () => {
    fetchEarnedBalance()
    fetchStakedBalance()
  }, [
    fetchEarnedBalance,
    fetchStakedBalance,
  ])

  const handleApprove = useCallback(() => {
    setConfirmTxModalIsOpen(true)
  }, [
    onApprove,
    setConfirmTxModalIsOpen,
  ])

  const handleHarvest = useCallback(async () => {
    if (!Flavor) return
    setConfirmTxModalIsOpen(true)
    await harvest(Flavor, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsHarvesting(true)
    })
    setIsHarvesting(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsHarvesting,
    Flavor
  ])

  const handleRedeem = useCallback(async () => {
    if (!Flavor) return
    setConfirmTxModalIsOpen(true)
    await redeem(Flavor, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsRedeeming(true)
    })
    setIsRedeeming(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsRedeeming,
    Flavor
  ])


  const handleDeposit = useCallback(async (asset: string, amount: string) => {
    if (!Flavor) return
    const assetAddress = FlavorTokenAddresses[asset]
    setConfirmTxModalIsOpen(true)
    if (!isApproved){
      await onApprove(assetAddress);
      window.console.log('approved!', isApproved);
    }
    await deposit(Flavor, assetAddress,
        amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsDepositing(true)
    })
    setIsDepositing(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsDepositing,
    Flavor
  ])


  const handleWithdraw = useCallback(async (asset: string, amount: string) => {
    if (!Flavor) return
    const assetAddress = FlavorTokenAddresses[asset]
    setConfirmTxModalIsOpen(true)
    // if (!isApproved){
    //   await onApprove(assetAddress);
    //   window.console.log('approved!', isApproved);
    // }
    await withdraw(Flavor, assetAddress,
        amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsWithdrawing(true)
    })
    setIsWithdrawing(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsWithdrawing,
    Flavor
  ])

  const handleUnstake = useCallback(async (amount: string) => {
    if (!Flavor) return
    setConfirmTxModalIsOpen(true)
    await unstake(Flavor, amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsUnstaking(true)
    })
    setIsUnstaking(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsUnstaking,
    Flavor
  ])

  useEffect(() => {
    fetchBalances()
    let refreshInterval = setInterval(() => fetchBalances(), 10000)
    return () => clearInterval(refreshInterval)
  }, [fetchBalances])

  useEffect(() => {
    let refreshInterval = setInterval(() => setCountdown(farmingStartTime - Date.now()), 1000)
    return () => clearInterval(refreshInterval)
  }, [setCountdown])

  return (
    <Context.Provider value={{
      countdown,
      earnedBalance,
      isApproved,
      isApproving,
      isHarvesting,
      isRedeeming,
      isStaking,
      isUnstaking,
      isDepositing,
      isWithdrawing,
      onApprove: handleApprove,
      onHarvest: handleHarvest,
      onRedeem: handleRedeem,
      onDeposit: handleDeposit,
      onWithdraw: handleWithdraw,
      onUnstake: handleUnstake,
      stakedBalance,
    }}>
      {children}
      <ConfirmTransactionModal isOpen={confirmTxModalIsOpen} />
    </Context.Provider>
  )
}

export default Provider
