import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Button } from 'react-neu'
import { useWallet } from 'use-wallet'

import UnlockWalletModal from 'components/UnlockWalletModal'
import WalletModal from 'components/WalletModal'

interface WalletButtonProps {}

const WalletButton: React.FC<WalletButtonProps> = (props) => {

  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false)
  const [unlockModalIsOpen, setUnlockModalIsOpen] = useState(false)

  const { account, reset } = useWallet()

  const handleDismissUnlockModal = useCallback(() => {
    setUnlockModalIsOpen(false)
  }, [setUnlockModalIsOpen])

  const handleDismissWalletModal = useCallback(() => {
    setWalletModalIsOpen(false)
  }, [setWalletModalIsOpen])

  const handleWalletClick = useCallback(() => {
    setWalletModalIsOpen(true)
  }, [setWalletModalIsOpen])

  const handleSignOut = useCallback(() => {
    reset()
  }, [reset])

  const handleUnlockWalletClick = useCallback(() => {
    setUnlockModalIsOpen(true)
  }, [setUnlockModalIsOpen])

  return (
    <>
      <StyledWalletButton>
        {!account ? (
          <Button
            onClick={handleUnlockWalletClick}
            size="sm"
            text="Unlock Wallet"
          />
        ) : (
          <Button
            onClick={handleSignOut}/*{handleWalletClick}*/
            size="sm"
            text="Sign Out"/* View Balances */
            variant="tertiary"
          />
        )}
      </StyledWalletButton>
      <WalletModal
        isOpen={walletModalIsOpen}
        onDismiss={handleDismissWalletModal}
      />
      <UnlockWalletModal
        isOpen={unlockModalIsOpen}
        onDismiss={handleDismissUnlockModal}
      />
    </>
  )
}

const StyledWalletButton = styled.div``

export default WalletButton
