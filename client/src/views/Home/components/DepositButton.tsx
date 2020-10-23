import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  Button,
} from 'react-neu'
import { useWallet } from 'use-wallet'
import useDeposit from 'hooks/useDeposit'

import DepositModal from 'components/DepositModal'
import UnlockWalletModal from 'components/UnlockWalletModal'
import {
  usdc as USDCAddress,
  FlavorTokens as FlavorTokenAddresses,
} from 'constants/tokenAddresses'

interface DepositButtonProps {
  asset: string
}


const DepositButtonWrapper = styled.div`
    margin-left: -12px;
    margin-top: 9px;
    width: 130px;
`;


const DepositButton: React.FC<DepositButtonProps> = ({
  asset,
}) => {

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  const [unlockModalIsOpen, setUnlockModalIsOpen] = useState(false)

  const wallet = useWallet()
  const {
    allowance,
    countdown,
    isApproved,
    isApproving,
    setIsApproved,
    isStaking,
    isUnstaking,
    onApprove,
    onDeposit,
    onUnstake,
    stakedBalance,
  } = useDeposit()


  const handleDepositClick = useCallback(async () => {
    setDepositModalIsOpen(true)
    await allowance.setSpenderAddress(FlavorTokenAddresses[asset]);
}, [setDepositModalIsOpen, wallet, allowance, asset])

  const handleDismissDepositClick = useCallback(() => {
    setDepositModalIsOpen(false)
    allowance && allowance.setAllowance(undefined)
    setIsApproved && setIsApproved(false)
  }, [setDepositModalIsOpen, setIsApproved, allowance])

  const handleDismissUnlockModal = useCallback(() => {
    setUnlockModalIsOpen(false)
    if (wallet.status !== 'connected') {
      handleDepositClick();
    }
  }, [setUnlockModalIsOpen])

  const handleUnlockWalletClick = useCallback(() => {
    setUnlockModalIsOpen(true)
  }, [setUnlockModalIsOpen])

  const depositBtn = useMemo(() => {
    if (wallet.status !== 'connected') {
      return (
        <React.Fragment>
        <Button
          onClick={handleUnlockWalletClick}
          full
          size="sm"
          text={flavoredAssetSymbol(asset)}
          variant="secondary"
        />
        <UnlockWalletModal
          isOpen={unlockModalIsOpen}
          onDismiss={handleDismissUnlockModal}
        />
        </React.Fragment>
      )

    }
    if (isStaking) {
      return (
        <Button
          disabled
          full
          text="Depositing..."
          variant="secondary"
        />
      )
    }


    if (isApproved || !isApproved) {
      return (
        <Button
          full
          size="sm"
          onClick={handleDepositClick}
          text={flavoredAssetSymbol(asset)}
          variant="secondary"
        />
      )
    }
  }, [
    countdown,
    handleDepositClick,
    isApproving,
    onApprove,
    wallet,
  ])
  return (
    <>
      <DepositButtonWrapper>
        {depositBtn}
      </DepositButtonWrapper>
      <DepositModal
        isOpen={depositModalIsOpen}
        onDismiss={handleDismissDepositClick}
        asset={asset}
      />
    </>
  )
}

const flavoredAssetSymbol = asset => (`FLAVOR-${asset}`);

export default DepositButton
