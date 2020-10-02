import React, { useCallback, useEffect, useState } from 'react'

import numeral from 'numeral'
import {
  Box,
  Card,
  CardContent,
  Spacer,
} from 'react-neu'

import FancyValue from 'components/FancyValue'
import useFlavor from 'hooks/useFlavor'
import { bnToDec } from 'utils'
import {
  getCurrentPrice,
  getScalingFactor,
} from 'flavor-sdk/utils'

const Stats: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState<string>()
  const [scalingFactor, setScalingFactor] = useState<string>()
  const Flavor = useFlavor()
  const fetchStats = useCallback(async () => {
    if (!Flavor) return
    const price = await getCurrentPrice(Flavor)
    const factor = await getScalingFactor(Flavor)
    setCurrentPrice(numeral(bnToDec(price)).format('0.00a'))
    setScalingFactor(numeral(bnToDec(factor)).format('0.00a'))
  }, [
    setCurrentPrice,
    setScalingFactor,
    Flavor,
  ])
  useEffect(() => {
    fetchStats()
    let refreshInterval = setInterval(fetchStats, 10000)
    return () => clearInterval(refreshInterval)
  }, [
    fetchStats,
    Flavor
  ])
  return (
    <Box column>
      <Card>
        <CardContent>
          <FancyValue
            icon="💲"
            label="Current price (TWAP)"
            value={currentPrice ? `${currentPrice} yUSD` : '--'}
          />
        </CardContent>
      </Card>
      <Spacer />
      <Card>
        <CardContent>
          <FancyValue
            icon="🎯"
            label="Target price"
            value="1 yUSD"
          />
        </CardContent>
      </Card>
      <Spacer />
      <Card>
        <CardContent>
          <FancyValue
            icon="🚀"
            label="Scaling factor"
            value={scalingFactor ? scalingFactor : '--'}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default Stats