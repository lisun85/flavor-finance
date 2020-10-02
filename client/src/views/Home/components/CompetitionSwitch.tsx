import React, { useEffect } from 'react'

import {
  Emoji,
  Switch,
  SwitchButton,
  useTheme,
} from 'react-neu'

import useLocalStorage from 'hooks/useLocalStorage'
import styled from 'styled-components'

const ButtonTitle = styled.span`

`;

const ButtonDescription = styled.span`
  padding-left: 5px;
  font-size: 0.6em;
`;

const SwitchContainer = styled.div`
  margin: 0 0 30px;
`;

const CompetitionSwitch = ({ competitionType, setCompetitionMode }) => {

  return (
    <SwitchContainer>
    <Switch>
      <SwitchButton
        active={competitionType === 'current'}
        onClick={() => setCompetitionMode('current')}
        round
      >
      <ButtonTitle>Current Competition</ButtonTitle>
      <ButtonDescription>Ends in 3 Days, 4 Hours, 10 Minutes</ButtonDescription>
      </SwitchButton>
      <SwitchButton
        active={competitionType === 'next'}
        onClick={() => setCompetitionMode('next')}
        round
      >
      <ButtonTitle>Next Competition</ButtonTitle>
      <ButtonDescription>Starts in 3 Days, 4 Hours, 10 Minutes</ButtonDescription>

      </SwitchButton>
    </Switch>
    </SwitchContainer>
  )
}

export default CompetitionSwitch
