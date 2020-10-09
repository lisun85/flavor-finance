import React, { useState } from 'react'
import {
  Container,
  Spacer,
  useTheme,
} from 'react-neu'

import Page from 'components/Page'
import PageHeader from 'components/PageHeader'
//import Split from 'components/Split'

import useBalances from 'hooks/useBalances'
import useAssetPrices from 'hooks/useAssetPrices'

import CompetitionSwitch from './components/CompetitionSwitch'
import MigrationNotice from './components/MigrationNotice'
//import Rebase from './components/Rebase'
import Stats from './components/Stats'
import CurrentCompetition from './components/CurrentCompetition'
import NextCompetition from './components/NextCompetition'
import styled from 'styled-components'

const Instruction = styled.div`
  margin: 10px 0;
`;

const HomeInstructions = () => (
  <div>
    <Instruction>
      <b>Here's how it works:</b>
    </Instruction>
    <Instruction>
      <b>Step 1</b>: Choose an asset shown below that you think will increase in price. Deposit USDC and receive FLAVOR-USDC tokens for the selected asset.
    </Instruction>
    <Instruction>
      <b>Step 2</b>: Deposited USDC is routed into the yUSDC yEarn vault and earns interest.
    </Instruction>
    <Instruction>
      <div><b>Step 3</b>:  Every day, interest earned is allocated to the FLAVOR-USDC token that has a corresponding asset with the largest relative daily price gain. Holders of this FLAVOR-USDC token receive an automatic increase in their token balance.</div>
      </Instruction>
    <Instruction style={{marginTop: 20}}>
      <b>A chance of winning without the risk of losing</b>
    </Instruction>
    <Instruction>
    <div>Whenever your selected asset does not win the daily prize period, you maintain your balance of the corresponding FLAVOR-USDC token.</div>
      </Instruction>
    <Instruction>
    <div>FLAVOR-USDC tokens are always redeemable for an equal amount of USDC, and you will always be able to withdraw an equal or greater amount of USDC that you had deposited.</div>
    </Instruction>

      {false && (
          <React.Fragment>
      <Instruction style={{marginTop: 20}}>
        <b>And a couple more things:</b>
      </Instruction>
      <Instruction>
        <b>FLAVOR</b>: You'll accumulate FLAVOR tokens every week, whether you win or lose.
      </Instruction>
      <Instruction>
        <b>Opting Out</b>: At any point, you can opt-out or opt-in to future competitions. Opting out means you'll earn interest at the normal rate without any withdrawal fees.
      </Instruction>
      </React.Fragment>
    )}


  </div>
);

const Home: React.FC = () => {
  const { darkMode } = useTheme()
  const { FlavorV2Balance } = useBalances()
  const [competitionType, setCompetitionMode] = useState('current');



  return (
    <Page>
      <PageHeader
        icon=""
        subtitle={HomeInstructions()}
        title="🌶️ &nbsp; A Spicy New Twist on Yield Farming &nbsp; 🌶️"
      />
      <Container>
        {false && (
          <CompetitionSwitch
          competitionType={competitionType}
          setCompetitionMode={setCompetitionMode}
        />
        )}
        {competitionType === 'current' && <CurrentCompetition /> }
        {competitionType === 'next' && <NextCompetition /> }
        <Spacer />
      </Container>
    </Page>
  )
}

export default Home
