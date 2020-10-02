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
      <b>Step 1</b>: Deposit stablecoin funds to start earning interest.
    </Instruction>
    <Instruction>
      <b>Step 2</b>: Select the crypto asset you think will have the largest price gain in the next week.
    </Instruction>
    <Instruction>
      <div><b>Step 3</b>: All interest earned during the week go to those who selected the winning asset.</div>
      <div>And if you lose, you lose only one week's interest and none of your principal.</div>
    </Instruction>
    <Instruction style={{marginTop: 20}}>
      <b>And a couple more things:</b>
    </Instruction>
    <Instruction>
      <b>FLAVOR</b>: You'll accumulate FLAVOR tokens every week, whether you win or lose.
    </Instruction>
    <Instruction>
      <b>Opting Out</b>: At any point, you can opt-out or opt-in to future competitions. Opting out means you'll earn interest at the normal rate without any withdrawal fees.
    </Instruction>
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
        <CompetitionSwitch
          competitionType={competitionType}
          setCompetitionMode={setCompetitionMode}
        />
        {(FlavorV2Balance && FlavorV2Balance.toNumber() > 0) && (
          <>
            <MigrationNotice />
            <Spacer />
          </>
        )}
        {competitionType === 'current' && <CurrentCompetition /> }
        {competitionType === 'next' && <NextCompetition /> }
        <Spacer />
      </Container>
    </Page>
  )
}

export default Home
