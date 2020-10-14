import React, { useMemo, useEffect } from 'react'

import {
  Card,
  CardContent,
  Container,
  Spacer,
} from 'react-neu'
import useAssetPrices from 'hooks/useAssetPrices'

import ExternalLink from 'components/ExternalLink'
import Page from 'components/Page'
import PageHeader from 'components/PageHeader'


const FAQ: React.FC = () => {

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
          <Card key={historyItem.date}>
            <CardContent>
            Date: {historyItem.date}
            <br/>
            Winning Asset: {historyItem.asset}
            <br/>
            Percent Change: {Math.round(historyItem.percentChange * 100) / 100}%
            <br/>
            Starting Price: {Math.round(historyItem.prizePeriodStartPrice * 100) / 100} USD
            <br/>
            Ending Price: {Math.round(historyItem.latestPrice * 100) / 100} USD
            </CardContent>
          </Card>
        ))}
      </Container>
    </Page>
  )
}


export default FAQ
