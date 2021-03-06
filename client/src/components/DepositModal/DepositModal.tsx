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
import useDeposit from 'hooks/useDeposit'

interface DepositModalProps {
  asset: string
  isOpen: boolean,
  onDismiss: () => void,
}

const DepositInstructionsBox = styled(Box)`
  margin-top: -40px;
  margin-bottom: 27px;
`;

const DepositInstruction = styled.p`
  margin-bottom: 0;
`;

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onDismiss,
  asset,
}) => {

  const { reset } = useWallet()
  const {
    USDCBalance,
    FlavorTokenBalances,
    fetchBalances
  } = useBalances()

  const [currentView, setCurrentView] = useState('overview')

  const getDisplayBalance = useCallback((value?: BigNumber, assetType?: string) => {
    if (value) {
      return numeral(value).format('0.00')
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


  const usdcBalance = USDCBalance !== undefined
    ? USDCBalance
    : new BigNumber(0)
  const usdcDisplayBalance = getDisplayBalance(usdcBalance, 'usdc')
  const usdcSymbolIcon = usdcDisplayBalance == '0.00'
  ? <span role="img" style={{ opacity: 0.5 }} >💵</span>
  : <span role="img">💵</span>

  const flavoredAssetBalance =  FlavorTokenBalances && FlavorTokenBalances[asset] !== undefined
    ? FlavorTokenBalances[asset]
    : new BigNumber(0)
  const flavoredAssetDisplayBalance = getDisplayBalance(flavoredAssetBalance, asset)
  const flavoredAssetSymbolIcon = flavoredAssetDisplayBalance == '0.00'
    ? <span role="img" style={{ opacity: 0.5 }} >🌶️</span>
    : <span role="img">🌶️</span>


  const depositModalOverview = (
    <>
      <ModalTitle text={flavoredAssetSymbol(asset)} />
        <ModalContent>
        <Box row>
          <DepositInstructionsBox column>
            <DepositInstruction>Whenever {asset} has had the largest daily price gain percent among all listed assets, your {flavoredAssetSymbol(asset)} balance will increase with an airdropped share of all FLAVOR interest earnings from the last 24 hours.</DepositInstruction>
            <DepositInstruction>The exchange rate between USDC and {flavoredAssetSymbol(asset)} is always 1-to-1.</DepositInstruction>
          </DepositInstructionsBox>
        </Box>

        <Separator />
        <Spacer />
          <Split>
          <Box column>
            <Box row>
              <FancyValue
                icon={usdcSymbolIcon}
                label="USDC balance"
                value={usdcDisplayBalance}
              />
            </Box>
            <Spacer />
            <Box row>
              <Button
                onClick={onClickDeposit}
                text={`Deposit USDC for ${flavoredAssetSymbol(asset)}`}
                size="sm"
              />
            </Box>
            </Box>
            <Box column>
            <Box row>
              <FancyValue
                icon={flavoredAssetSymbolIcon}
                label={`${flavoredAssetSymbol(asset)} balance`}
                value={flavoredAssetDisplayBalance}
              />
           </Box>
           <Spacer />
           <Box row>
              <Button
                onClick={onClickWithdraw}
                text={`Withdraw ${flavoredAssetSymbol(asset)} for USDC`}
                size="sm"
              />
            </Box>
            </Box>
          </Split>
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
          asset={asset}
          assetBalance={usdcBalance}
          onBack={onBack}
          fetchBalances={fetchBalances}
        />
      )}
      {currentView === 'withdraw' && (
        <Withdraw
          asset={asset}
          assetBalance={flavoredAssetBalance}
          onBack={onBack}
          fetchBalances={fetchBalances}
        />
      )}
    </Modal>
  )
}

interface DepositProps {
  asset: string,
  assetBalance: BigNumber,
  onBack: () => void
  fetchBalances: () => void
}

const Deposit: React.FC<DepositProps> = ({
  asset,
  assetBalance,
  onBack,
  fetchBalances
}) => {

  const [val, setVal] = useState('')
  const fullBalance = assetBalance

  const {
    onDeposit,
    isStaking
  } = useDeposit()

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance.toString())
  }, [fullBalance, setVal])

  const handleDeposit = useCallback(() => {
    onDeposit(asset, val, fetchBalances)
    onBack()
  }, [onDeposit, val, asset, onBack, fetchBalances])

  return (
    <>
      <ModalTitle text={`Deposit USDC for ${flavoredAssetSymbol(asset)}`} />
        <ModalContent>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance.toString()}
          symbol={'USDC'}
        />
        </ModalContent>
        <Separator />
        <ModalActions>
        <Button
          disabled={!val}
          onClick={handleDeposit}
          text="Continue"
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
  asset,
  assetBalance,
  onBack,
  fetchBalances
}) => {

  const [val, setVal] = useState('')
  const fullBalance = assetBalance

  const {
    onWithdraw
  } = useDeposit()

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance.toString())
  }, [fullBalance, setVal])

  const handleWithdraw = useCallback(() => {
    onWithdraw(asset, val, fetchBalances)
    onBack()
  }, [onWithdraw, val, asset, onBack])

  return (
    <>
      <ModalTitle text={`Withdraw ${flavoredAssetSymbol(asset)} for USDC`} />
        <ModalContent>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance.toString()}
          symbol={flavoredAssetSymbol(asset)}
        />
        </ModalContent>
        <Separator />
        <ModalActions>
        <Button
          disabled={!val}
          onClick={handleWithdraw}
          text="Continue"
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

const flavoredAssetSymbol = asset => (`FLAVOR-${asset}`);


export default DepositModal
