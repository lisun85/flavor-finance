import React, { useCallback, useState } from 'react'

import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import numeral from 'numeral'
import {
  Box,
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalProps,
  ModalTitle,
  Separator,
  Spacer
} from 'react-neu'
import TokenInput from 'components/TokenInput'
import FancyValue from 'components/FancyValue'
import Split from 'components/Split'

import useBalances from 'hooks/useBalances'

interface DepositModalProps {
  asset: string
  isOpen: boolean,
  onDismiss: () => void,
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onDismiss,
  asset,
}) => {

  const { reset } = useWallet()
  const {
    FlavorV2Balance,
    FlavorV3Balance
  } = useBalances()

  const [currentView, setCurrentView] = useState('overview')

  const getDisplayBalance = useCallback((value?: BigNumber) => {
    if (value) {
      return numeral(value).format('0.00a')
    } else {
      return '--'
    }
  }, [])

  const handleSignOut = useCallback(() => {
    reset()
  }, [reset])

  const onClickDeposit = useCallback(() => {
    setCurrentView('deposit')
  }, [setCurrentView])
  const onClickWithdraw = useCallback(() => {
    setCurrentView('withdraw')
  }, [setCurrentView])

  const onBack = useCallback(() => {
    setCurrentView('overview')
  }, [setCurrentView])

  const usdcBalance = getDisplayBalance(FlavorV3Balance)
  const usdcSymbolIcon = usdcBalance == '0.00'
  ? <span role="img" style={{ opacity: 0.5 }} >💵</span>
  : <span role="img">💵</span>

  const flavoredAssetSymbol = `FLAVOR-USDC-${asset}`
  const flavoredAssetBalance = getDisplayBalance(FlavorV2Balance)
  const flavoredAssetSymbolIcon = flavoredAssetBalance == '0.00'
    ? <span role="img" style={{ opacity: 0.5 }} >🌶️</span>
    : <span role="img">🌶️</span>


  const depositModalOverview = (
    <>
      <ModalTitle text={flavoredAssetSymbol} />
        <ModalContent>
          <Split>
            <Box row>
              <FancyValue
                icon={usdcSymbolIcon}
                label="USDC balance"
                value={usdcBalance}
              />
              <Button
                onClick={onClickDeposit}
                text="Deposit"
                variant="secondary"
              />
            </Box>
            <Box row>
              <FancyValue
                icon={flavoredAssetSymbolIcon}
                label={`${flavoredAssetSymbol} balance`}
                value={flavoredAssetBalance}
              />
              <Button
                onClick={onClickWithdraw}
                text="Withdraw"
                variant="secondary"
              />
            </Box>
          </Split>
          <Spacer />
          <Separator />
          <Spacer />
        </ModalContent>
        <Separator />
        <ModalActions>
          <Button
            onClick={onDismiss}
            text="Close"
            variant="secondary"
          />
        </ModalActions>
        </>
    )

  return (
    <Modal isOpen={isOpen}>
      {currentView === 'overview' && depositModalOverview}
      {currentView === 'deposit' && (
        <Deposit
          flavoredAssetSymbol={flavoredAssetSymbol}
          onBack={onBack}
        />
      )}
      {currentView === 'withdraw' && (
        <Withdraw
          flavoredAssetSymbol={flavoredAssetSymbol}
          onBack={onBack}
        />
      )}
    </Modal>
  )
}


interface DepositProps {
  flavoredAssetSymbol: string
  onBack: () => void,
}

const Deposit: React.FC<DepositProps> = ({
  flavoredAssetSymbol,
  onBack
}) => {

  const [val, setVal] = useState('')
  const fullBalance = '0'
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleDeposit = useCallback(() => {
    window.console.log('handleDeposit', val)
  }, [val])

  return (
    <>
      <ModalTitle text={`Exchange USDC for ${flavoredAssetSymbol}`} />
        <ModalContent>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={'USDC'}
        />
        </ModalContent>
        <Separator />
        <ModalActions>
        <Button
          onClick={handleDeposit}
          text="Deposit"
        />
          <Button
            onClick={onBack}
            text="Back"
            variant="secondary"
          />
        </ModalActions>
      </>
  )
}


const Withdraw: React.FC<DepositProps> = ({
  flavoredAssetSymbol,
  onBack
}) => {

  const [val, setVal] = useState('')
  const fullBalance = '0'
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleWithdraw = useCallback(() => {
    window.console.log('handleWithdraw', val);
  }, [val])

  return (
    <>
      <ModalTitle text={`Exchange ${flavoredAssetSymbol} for USDC`} />
        <ModalContent>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={flavoredAssetSymbol}
        />
        </ModalContent>
        <Separator />
        <ModalActions>
        <Button
          onClick={handleWithdraw}
          text="Withdraw"
        />
          <Button
            onClick={onBack}
            text="Back"
            variant="secondary"
          />
        </ModalActions>
      </>
  )
}


export default DepositModal
