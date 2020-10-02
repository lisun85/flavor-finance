import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://discord.gg/nKKhBbk">Discord</StyledLink>
      <StyledLink href="https://github.com/Flavor-finance/Flavor-www">Github</StyledLink>
      <StyledLink href="https://twitter.com/FlavorFinance">Twitter</StyledLink>
      <StyledLink href="https://snapshot.page/#/Flavor">Proposals</StyledLink>
      <StyledLink href="https://forum.Flavor.finance">Forum</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${props => props.theme.colors.grey[500]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.grey[600]};
  }
`

export default Nav
