import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Separator,
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


const ButtonWrapper = styled.div`
  button {
    margin: auto;
  }
`;

const Instruction = styled.div`
  margin: 10px 0;
`;

const DetailInstruction = styled.div`
  margin: 20px 0;
  line-height: 1.8em;
  font-size: 21px;
`;

const InstructionsWrapper = styled.div`
    margin-bottom: 25px;
    text-align: center;
    margin-top: -84px;
    max-width: 880px;
`;

const InstructionsIntro = styled.div`
  font-size: 23px;
`;

const HomeInstructions : React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <InstructionsWrapper>
    <Spacer size="md" />
    <InstructionsIntro>
      <Instruction>
        <b>Flavor provides a simple, low-risk way to bet on your favorite assets.</b>
      </Instruction>
      <Instruction>
        <b>When you win, FLAVOR stablecoins appear in your wallet as a reward.</b>
      </Instruction>
      <Instruction>
        <b>And nobody loses - you can always withdraw at least what you've deposited.</b>
      </Instruction>
    </InstructionsIntro>

    {!showDetails
      ? (
        <ButtonWrapper>
          <Spacer size="md" />
          <Button onClick={() => setShowDetails(true)}>How It Works</Button>
        </ButtonWrapper>
      ) : (
        <React.Fragment>
        <Box marginTop={4} marginHorizontal={4}>
          <Separator />
          <Spacer size="sm" />
        </Box>

          <DetailInstruction>
            <b>Exchange USDC for FLAVOR tokens</b>: Choose an asset shown below that you predict will increase in price. Exchange USDC for FLAVOR tokens corresponding to your selected asset. Deposited USDC earns daily interest through <a href="https://yearn.finance/vaults">yUSDC yEarn vaults</a>.
          </DetailInstruction>
          <DetailInstruction>
            <div><b>Daily Airdrops</b>:  Once a day, the Flavor contract determines the prediction asset with the largest daily price increase by percentage. Accrued interest earnings are rewarded via FLAVOR airdrops to holders of the winning token. Nobody ever loses deposited funds.</div>
            </DetailInstruction>
            <DetailInstruction>
              <div><b>Positive-Sum Stablecoins</b>:  FLAVOR tokens are fully collateralized and can always be exchanged for an equal amount of USDC. This along with the positive-sum prize mechanic make FLAVOR tokens a fun and low-risk replacement for USDC in your wallet.</div>
              </DetailInstruction>
          </React.Fragment>
      )}
    </InstructionsWrapper>
  );

}

const Home: React.FC = () => {
  const { darkMode } = useTheme()
  const { FlavorV2Balance } = useBalances()
  const [competitionType, setCompetitionMode] = useState('current');



  return (
    <Page>
      <PageHeader
        icon=""
        title="🌶️ &nbsp; A Spicy New Twist on DeFi Savings &nbsp; 🌶️"
      />
      <HomeInstructions />
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
