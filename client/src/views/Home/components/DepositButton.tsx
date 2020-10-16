import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  Button,
} from 'react-neu'
import { useWallet } from 'use-wallet'
import useFarming from 'hooks/useFarming'
import DepositModal from 'components/DepositModal'
import UnlockWalletModal from 'components/UnlockWalletModal'

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

  const { status } = useWallet()
  const {
    countdown,
    farmingStartTime,
    isApproved,
    isApproving,
    isStaking,
    isUnstaking,
    onApprove,
    onStake,
    onUnstake,
    stakedBalance,
  } = useFarming()

  const handleDepositClick = useCallback(() => {
    setDepositModalIsOpen(true)
  }, [setDepositModalIsOpen])

  const handleDismissDepositClick = useCallback(() => {
    setDepositModalIsOpen(false)
  }, [setDepositModalIsOpen])

  const handleDismissUnlockModal = useCallback(() => {
    setUnlockModalIsOpen(false)
  }, [setUnlockModalIsOpen])

  const handleUnlockWalletClick = useCallback(() => {
    setUnlockModalIsOpen(true)
  }, [setUnlockModalIsOpen])

  const depositBtn = useMemo(() => {
    if (status !== 'connected') {
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
    if (!isApproved) {
      return (
        <Button
          disabled={isApproving}
          full
          size="sm"
          onClick={handleDepositClick}
          text={!isApproving ? flavoredAssetSymbol(asset) : "Approving deposit..."}
          variant={isApproving || status !== 'connected' ? 'secondary' : 'secondary'}
        />
      )
    }

    if (isApproved) {
      return (
        <Button
          full
          onClick={handleDepositClick}
          text="Stake"
        />
      )
    }
  }, [
    countdown,
    handleDepositClick,
    isApproving,
    onApprove,
    status,
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
