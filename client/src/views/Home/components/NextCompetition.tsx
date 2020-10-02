import React from 'react'

import numeral from 'numeral'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardTitle,
  Separator,
  Spacer,
} from 'react-neu'

import FancyValue from 'components/FancyValue'
import Split from 'components/Split'
import styled from 'styled-components'

const Asset = styled(Box)`
  margin: 20px 10px;
`;

const AssetPrice = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const CardTitleWrapper = styled.div`
  font-weight: bold;
`;

const NextCompetition: React.FC = () => {

  const startTime =   '--'

  const endTime = '--'

  const timeUntilStart = '--'

  const assets = [
    {
      symbol: 'SNX',
      name: 'Synthetix',
      currentPrice: '4.50',
      pricePercentChange: '+10%',
      isSelected: false
    },
    {
      symbol: 'LEND',
      name: 'Aave',
      currentPrice: '0.55',
      pricePercentChange: '-5.5%',
      isSelected: true
    },
  ]

  return (
    <Card>
    <CardTitleWrapper>
      <CardTitle text="Next Competition" />
    </CardTitleWrapper>
      <Spacer size="sm" />
      <CardContent>
        <Split>
          <FancyValue
            icon="📅"
            label="Start time"
            value={startTime}
          />
          <FancyValue
            icon="🏁"
            label="End time"
            value={endTime}
          />
          <FancyValue
            icon="🕒"
            label="Time until start"
            value={timeUntilStart}
          />
        </Split>
      </CardContent>
      <Box marginTop={4} marginHorizontal={4}>
        <Separator />
      </Box>
      {assets.map(asset => (
        <Asset>
          <Split>
            <FancyValue
              icon="📅"
              label={asset.name}
              value={asset.symbol}
            />
            <Box flex={1}>
              <AssetPrice>
                {`${asset.currentPrice} USD`}
              </AssetPrice>
            </Box>
            <Box flex={1}>
              {asset.isSelected ?
                (
                  <span>Selected</span>
                ) :
                (
                  <Button
                    text="Select"
                    variant="secondary"
                  />
                )
              }
            </Box>

          </Split>
        </Asset>
        )
      )}
      <CardActions>
        <Box row justifyContent="center">
          <Button
            text="Refresh Prices"
            variant="secondary"
          />
        </Box>
      </CardActions>
    </Card>
  )
}

export default NextCompetition
