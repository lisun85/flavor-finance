import React from 'react'
import { Container, Spacer } from 'react-neu'

import Page from 'components/Page'
import PageHeader from 'components/PageHeader'
import Split from 'components/Split'

import MigrateCard from './components/MigrateCard'
import VestingNotice from './components/VestingNotice'

const Funds: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon="💵"
        subtitle=""
        title="Deposit & Withdraw Funds"
      />
      <Container>
        <Spacer />
        <Split>
          <MigrateCard />
        </Split>
      </Container>
    </Page>
  )
}

export default Funds
