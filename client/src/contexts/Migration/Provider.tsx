import React, { useCallback, useState } from 'react'
import { useWallet } from 'use-wallet'

import { Flavorv2 as FlavorV2Address } from 'constants/tokenAddresses'
import useApproval from 'hooks/useApproval'
import useFlavor from 'hooks/useFlavor'
import { migrateV3 } from 'flavor-sdk/utils'

import ConfirmTransactionModal from 'components/ConfirmTransactionModal'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const { account } = useWallet()
  const Flavor = useFlavor()
  const [isMigrating, setIsMigrating] = useState(false)
  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false)

  const { isApproved, isApproving, onApprove } = useApproval(
    FlavorV2Address,
    undefined,//Flavor ? Flavor.contracts.migrator.options.address : undefined,
    () => setConfirmTxModalIsOpen(false)
  )

  const handleApprove = useCallback(() => {
    setConfirmTxModalIsOpen(true)
    onApprove()
  }, [
    onApprove,
    setConfirmTxModalIsOpen,
  ])

  const handleMigrationTxSent = useCallback(() => {
    setIsMigrating(true)
    setConfirmTxModalIsOpen(false)
  }, [
    setIsMigrating,
    setConfirmTxModalIsOpen
  ])

  const handleMigrate = useCallback(async () => {
    setConfirmTxModalIsOpen(true)
    await migrateV3(Flavor, account, handleMigrationTxSent)
    setIsMigrating(false)
  }, [
    account,
    handleMigrationTxSent,
    setConfirmTxModalIsOpen,
    setIsMigrating,
    Flavor
  ])

  return (
    <Context.Provider value={{
      isApproved,
      isApproving,
      onApprove: handleApprove,
      onMigrate: handleMigrate,
      isMigrating,
    }}>
      {children}
      <ConfirmTransactionModal isOpen={confirmTxModalIsOpen} />
    </Context.Provider>
  )
}

export default Provider
