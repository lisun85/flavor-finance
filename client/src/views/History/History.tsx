import React, { useMemo, useEffect } from 'react'

import {
  Card,
  CardContent,
  Container,
  Spacer,
} from 'react-neu'
import useAssetPrices from 'hooks/useAssetPrices'
import styled from 'styled-components'
import ExternalLink from 'components/ExternalLink'
import Page from 'components/Page'
import PageHeader from 'components/PageHeader'

const HistoryCard = styled.div`
  margin-bottom: 20px;
`;

const HistoryData = styled.p`
  margin-bottom: 0;
  margin-top: 5px;
`;

const HistoryDataLarge = styled(HistoryData)`
  font-size: 1.2em;
  font-weight: bold;
`;

const formatDate = date => {
  const year = date.slice(0,4);
  const monthDay = date.slice(5).replace(/-/g,'/');
  return `${monthDay}/${year}`;
}

const History: React.FC = () => {

  const {
    history,
    fetchHistory
  } = useAssetPrices()

  useEffect(() => {
    fetchHistory();
  }, [])



  return (
    <Page>
      <PageHeader
        icon="🌶️"
        subtitle=""
        title="Prize Period History"
      />
      <Container>
        {history.map(historyItem => (
          <HistoryCard key={historyItem.date}>
            <Card>
            <CardContent>
            <HistoryDataLarge>Date: {formatDate(historyItem.date)}</HistoryDataLarge>
            <HistoryDataLarge>Winning Asset: {historyItem.asset}</HistoryDataLarge>
            <Spacer size="sm" />
            <HistoryData>Percent Change: {Math.round(historyItem.percentChange * 100) / 100}%</HistoryData>
            <HistoryData>Starting Price: {Math.round(historyItem.prizePeriodStartPrice * 100) / 100} USD</HistoryData>
            <HistoryData>Ending Price: {Math.round(historyItem.latestPrice * 100) / 100} USD</HistoryData>
            </CardContent>
            </Card>
          </HistoryCard>
        ))}
      </Container>
    </Page>
  )
}


export default History
