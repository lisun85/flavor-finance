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

import FancyValue from 'components/FancyValue'
import Split from 'components/Split'
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
  font-size: 16px;
  padding-left: 10px;
`;

const AssetPercentChangePositive = styled(AssetPercentChange)`
  color: green;
`;

const AssetPercentChangeNegative = styled(AssetPercentChange)`
  color: red;
`;


const AssetPriceInfo = styled.div`
  font-size: 12px;
  text-align: center;
  margin: 10px 0;
`;

const CardTitleWrapper = styled.div`
  font-weight: bold;
`;

const ASSET_NAMES = {
  "BTC": "Bitcoin",
  "ETH": "Ethereum",
  "LINK": "Chainlink"
}

const ASSET_ICONS = {
  "BTC": "₿",
  "ETH": "Ξ",
  "LINK": "⬡"
}

/*
getFullYear() - Returns the 4-digit year
getMonth() - Returns a zero-based integer (0-11) representing the month of the year.
getDate() - Returns the day of the month (1-31).
getDay() - Returns the day of the week (0-6). 0 is Sunday, 6 is Saturday.
getHours() - Returns the hour of the day (0-23).
getMinutes() - Returns the minute (0-59).
getSeconds() - Returns the second (0-59).
getMilliseconds() - Returns the milliseconds (0-999).
getTimezoneOffset() - Returns the number of minutes between the machine local time and UTC.



*/

const timeFormat = dt => (
  `${dt.getMonth()}/${dt.getDate()} ${dt.getHours()}:00`
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
    <Card>
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
      </CardContent>
      <Box marginTop={4} marginHorizontal={4}>
        <Separator />
      </Box>
      <AssetPriceInfo>
        All price percent changes are calculated from the start time of <b>09:00 GMT, Monday October 5th</b>
      </AssetPriceInfo>
      {assets.map(asset => (
        <Asset>
          <Split>
            <FancyValue
              icon={ASSET_ICONS[asset.asset]}
              label={ASSET_NAMES[asset.asset]}
              value={asset.asset}
            />
            <Box flex={1}>
              <AssetPrice>
                {`${Math.round(asset.latestPrice * 100) / 100} USD`}
                {asset.PercentChange >= 0
                  ? (
                    <AssetPercentChangePositive>
                    {`(${Math.round(asset.percentChange * 100) / 100}%)`}
                  </AssetPercentChangePositive>
                ) :
                (
                  <AssetPercentChangeNegative>
                  {`(${Math.round(asset.percentChange * 100) / 100}%)`}
                </AssetPercentChangeNegative>
              )
                }
              </AssetPrice>
            </Box>
            <Box flex={1}>
            </Box>

          </Split>
        </Asset>
        )
      )}
    </Card>
  )
}

export default CurrentCompetition
