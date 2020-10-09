import React, { useCallback, useMemo, useState } from 'react'

import {
  Button,
} from 'react-neu'
import { useWallet } from 'use-wallet'
import useFarming from 'hooks/useFarming'
import DepositModal from 'components/DepositModal'

interface DepositButtonProps {
  asset: string
}


const DepositButton: React.FC<DepositButtonProps> = ({
  asset,
}) => {

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)

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

  const depositBtn = useMemo(() => {
    if (status !== 'connected') {
      return (
        <Button
          disabled
          full
          text="Deposit"
          variant="secondary"
        />
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
          onClick={handleDepositClick}
          text={!isApproving ? "Deposit" : "Approving deposit..."}
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
      {depositBtn}
      <DepositModal
        isOpen={depositModalIsOpen}
        onDismiss={handleDismissDepositClick}
        asset={asset}
      />
    </>
  )
}

export default DepositButton
