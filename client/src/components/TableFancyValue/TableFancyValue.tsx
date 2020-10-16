import React from 'react'
import { Box, Spacer } from 'react-neu'
import styled from 'styled-components'

import Label from 'components/Label'
import Value from 'components/Value'

interface TableFancyValueProps {
  icon: React.ReactNode,
  label: string,
  value: string,
}

const FancyBox = styled(Box)`
  width: 150px;
`;

const TableFancyValue: React.FC<TableFancyValueProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <FancyBox
      flex='initial'
      alignItems="center"
      row
    >
      <Box row justifyContent="center" minWidth={48}>
        <StyledIcon>{icon}</StyledIcon>
      </Box>
      <Spacer size="sm" />
      <Box flex={1}>
        <Value value={value} />
        <Label text={label} />
      </Box>
    </FancyBox>
  )
}

const StyledIcon = styled.span.attrs({ role: 'img' })`
  font-size: 32px;
`

export default TableFancyValue
