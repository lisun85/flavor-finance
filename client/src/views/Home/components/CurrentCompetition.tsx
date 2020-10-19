import React, { useEffect, useState } from 'react'

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
import Label from 'components/Label'
import Value from 'components/Value'
import FancyValue from 'components/FancyValue'
import TableFancyValue from 'components/TableFancyValue'
import Split from 'components/Split'
import DepositButton from './DepositButton'
import styled from 'styled-components'
import useAssetPrices from 'hooks/useAssetPrices'

const Asset = styled(Box)`
  margin: 20px 10px;
`;

const AssetPrice = styled.span`
  font-size: 25px;
  font-weight: bold;
`;

const AssetPercentChange = styled.span`
  font-size: 18px;
  font-weight: bold;
  padding-left: 10px;
  padding-top:4px;
`;

const AssetPercentChangePositive = styled(AssetPercentChange)`
  color: green;
`;

const AssetPercentChangeNegative = styled(AssetPercentChange)`
  color: red;
`;

const CurrentCompetitionCard = styled.div`
  @media only screen and (max-width: 980px) {
    display: none;
  }
`

const PriceValue = styled.span`
  font-size: 22px;
  font-weight: 700;
`;


const CardTitleWrapper = styled.div`
  font-weight: bold;

  span{
    font-size: 1.6em;
  }
`;

const WinningInstruction = styled.p`
    font-size: 0.8em;
    text-align: center;
    margin-top: 15px;
    margin-bottom: -5px;
    font-weight: normal;
    margin-left: -30px;
`;

const StartingPriceBox = styled(Box)`
width: 130px;
`;

const LatestPriceBox = styled(Box)`
width: 130px;
`;

const PercentChangeBox = styled(Box)`
width: 142px;
padding-left: 15px;
`;

const DepositButtonBox = styled(Box)`
width: 130px;
margin-left: 0px;
`;

const ASSET_NAMES = {
  "BTC": "Bitcoin",
  "ETH": "Ethereum",
  "SDEFI": "sDeFi Index"
}

const ASSET_ICONS = {
  "BTC": "₿",
  "ETH": "Ξ",
  "SDEFI": "🧩"
}

const timeFormat = dt => (
  `${dt.toLocaleString('default', { month: 'short' })} ${dt.getDate()} ${dt.getHours()}:00`
)

const CurrentCompetition: React.FC = () => {
  const now = new Date();
  const DEFAULT_PRIZE_PERIOD_SCHEDULE = {
    startTime: timeFormat(now),
    endTime: timeFormat(now),
    timeUntilEnd: ''
  }
  const [schedule, setPrizePeriodSchedule] = useState(DEFAULT_PRIZE_PERIOD_SCHEDULE);

  useEffect(() => {
    const prizePeriodSchedule = {
      ...DEFAULT_PRIZE_PERIOD_SCHEDULE
    }
    const todayCycleTime = new Date();
    todayCycleTime.setUTCHours(0,0,0,0);
    const endTime = new Date(todayCycleTime.getTime());
    if (now > todayCycleTime) {
      endTime.setDate(todayCycleTime.getDate() + 1);
      prizePeriodSchedule.startTime = timeFormat(todayCycleTime);
    } else {
      const startTime = new Date(todayCycleTime.getTime());
      startTime.setDate(todayCycleTime.getDate() - 1);
      prizePeriodSchedule.startTime = timeFormat(startTime);
    }
    prizePeriodSchedule.endTime = timeFormat(endTime);
    const hoursUntilEnd = Math.round(10 * Math.abs(endTime.getTime() - now.getTime()) / 3600000)/10 ;
    prizePeriodSchedule.timeUntilEnd =  `${hoursUntilEnd} hours`;
    setPrizePeriodSchedule(prizePeriodSchedule);
  }, [])



    const {
      assets,
      fetchAssets
    } = useAssetPrices()

    useEffect(() => {
      fetchAssets();
    }, [])

  if (!assets.length) {
    return null;
  }
  return (
    <React.Fragment>
    <Card>
    <CurrentCompetitionCard>
    <CardTitleWrapper>
      <CardTitle text="Current Prize Period" />
    </CardTitleWrapper>
      <Spacer size="sm" />
      <CardContent>
        <Split>
          <FancyValue
            icon="📅"
            label="Start time"
            value={schedule.startTime}
          />
          <FancyValue
            icon="🏁"
            label="End time"
            value={schedule.endTime}
          />
          <FancyValue
            icon="🕒"
            label="Time until end"
            value={schedule.timeUntilEnd}
          />
        </Split>
        <WinningInstruction>The winning asset has the largest percentage price increase from the prize period start time to end time.</WinningInstruction>

      </CardContent>
      {assets.map(asset => (
        <Asset key={asset.asset}>
          <Box marginTop={4} marginHorizontal={4}>
            <Separator />
          </Box>
          <Spacer size="md" />
          <Split>
            <TableFancyValue
              icon={ASSET_ICONS[asset.asset]}
              label={ASSET_NAMES[asset.asset]}
              value={asset.asset}
            />
            <Box
            flex={3}
            row
            >
              <StartingPriceBox
                alignItems="center"
                column
              >
                <Label text="Starting Price" />
                <PriceValue>${Math.round(asset.prizePeriodStartPrice * 100) / 100}</PriceValue>
              </StartingPriceBox>
              <LatestPriceBox
                alignItems="center"
                column

              >
                <Label text="Current Price" />
                <PriceValue>${Math.round(asset.latestPrice * 100) / 100}</PriceValue>
              </LatestPriceBox>
              <PercentChangeBox
                alignItems="baseline"
                column
              >
                <Label text="Change" />
                {asset.percentChange >= 0
                  ? (
                    <AssetPercentChangePositive>
                    {`${Math.round(asset.percentChange * 100) / 100}%`}
                  </AssetPercentChangePositive>
                ) :
                (
                  <AssetPercentChangeNegative>
                  {`${Math.round(asset.percentChange * 100) / 100}%`}
                </AssetPercentChangeNegative>
              )
                }
              </PercentChangeBox>
              <DepositButtonBox>
                <DepositButton
                  asset={asset.asset}
                />
              </DepositButtonBox>
            </Box>
          </Split>
        </Asset>
        )
      )}
    </CurrentCompetitionCard>
    </Card>
    </React.Fragment>
  )
}

export default CurrentCompetition
