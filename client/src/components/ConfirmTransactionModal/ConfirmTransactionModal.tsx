import React, { useMemo } from 'react'
import {
  Modal,
  ModalContent,
  ModalProps,
  Spacer,
} from 'react-neu'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import metamaskLogo from 'assets/metamask-fox.svg'
import walletConnectLogo from 'assets/wallet-connect.svg'

interface TxModalProps {
  message?: string
}

const ConfirmTransactionModal: React.FC<ModalProps & TxModalProps> = ({
  isOpen,
  message,
}) => {
  const { connector } = useWallet()

  const WalletLogo = useMemo(() => {
    if (connector === 'injected') {
      return <img src={metamaskLogo} height={96} />
    } else if (connector === 'walletconnect') {
      return <img src={walletConnectLogo} height={72} />
    }
  }, [connector])

  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        {WalletLogo}
        <Spacer />
        <StyledText>{message}</StyledText>
      </ModalContent>
    </Modal>
  )
}

const StyledText = styled.div`
  font-size: 24px;
  text-align: center;
`

export default ConfirmTransactionModal
