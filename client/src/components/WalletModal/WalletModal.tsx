import React, { useCallback } from 'react'

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

import FancyValue from 'components/FancyValue'
import Split from 'components/Split'

import useBalances from 'hooks/useBalances'

const WalletModal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
}) => {

  const { reset } = useWallet()
  const {
    FlavorV2Balance,
    FlavorV3Balance
  } = useBalances()


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

  return (
    <Modal isOpen={isOpen}>
      <ModalTitle text="My Wallet" />
      <ModalContent>
        <Split>
          <Box row>
            <FancyValue
              icon="🌶️"
              label="FLAVOR balance"
              value={getDisplayBalance(FlavorV3Balance)}
            />
          </Box>
          <Box row>
            <FancyValue
              icon={<span role="img" style={{ opacity: 0.5 }} >🌶️</span>}
              label="FLAVOR-UNI-LP balance"
              value={getDisplayBalance(FlavorV2Balance)}
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
          text="Cancel"
          variant="secondary"
        />
        <Button
          onClick={handleSignOut}
          text="Sign Out"
        />
      </ModalActions>
    </Modal>
  )
}

export default WalletModal
