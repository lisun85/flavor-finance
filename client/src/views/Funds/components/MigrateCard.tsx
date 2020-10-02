import React, { useMemo } from 'react'

import numeral from 'numeral'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardIcon,
} from 'react-neu'
import { useWallet } from 'use-wallet'

import Label from 'components/Label'
import Value from 'components/Value'

import useBalances from 'hooks/useBalances'
import useMigration from 'hooks/useMigration'

const MigrateCard: React.FC = () => {
  const { status } = useWallet()
  const { FlavorV2Balance } = useBalances()
  const {
    isApproved,
    isApproving,
    isMigrating,
    onApprove,
    onMigrate,
  } = useMigration()

  const FlavorV2DisplayBalance = useMemo(() => {
    if (FlavorV2Balance) {
      return numeral(FlavorV2Balance).format('0.00a')
    } else {
      return '--'
    }
  }, [FlavorV2Balance])

  const ActionButton = useMemo(() => {
    const hasFlavors = FlavorV2Balance && FlavorV2Balance.toNumber() > 0
    if (isMigrating) {
      return (
        <Button
          disabled
          full
          text="Migrating..."
          variant="secondary"
        />
      )
    }
    if (isApproved) {
      return (
        <Button
          disabled={!hasFlavors}
          full
          onClick={onMigrate}
          text="Migrate"
          variant={hasFlavors ? 'default' : 'secondary'}
        />
      )
    }
    return (
      <Button
        disabled={isApproving || status !== 'connected'}
        full
        onClick={onApprove}
        text={!isApproving ? "Make Deposit" : "Making deposit..."}
        variant={isApproving || status !== 'connected' ? 'secondary' : 'default'}
      />
    )
  }, [
    status,
    isApproved,
    isApproving,
    isMigrating,
    onApprove,
    onMigrate,
    FlavorV2Balance
  ])

  return (
    <Card>
      <CardIcon>
        <span style={{opacity:0.5}}>🌶️</span></CardIcon>
      <CardContent>
        <Box alignItems="center" column>
          <Value value={FlavorV2DisplayBalance} />
          <Label text="Balance" />
        </Box>
      </CardContent>
      <CardActions>
        {ActionButton}
      </CardActions>
    </Card>
  )
}

export default MigrateCard
