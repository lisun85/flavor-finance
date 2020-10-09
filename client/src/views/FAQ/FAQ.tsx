import React, { useMemo } from 'react'

import {
  Card,
  CardContent,
  Container,
  Spacer,
} from 'react-neu'
import { useLocation } from 'react-router-dom'

import ExternalLink from 'components/ExternalLink'
import Page from 'components/Page'
import PageHeader from 'components/PageHeader'

import Question from './components/Question'

const FAQ: React.FC = () => {
  const { pathname } = useLocation()
  const pathArr = pathname.split('/')

  const activeSlug = useMemo(() => {
    if (pathArr.length > 2) {
      return pathArr[2]
    }
  }, [pathArr])

  return (
    <Page>
      <PageHeader
        icon="🌶️"
        subtitle=""
        title="A Spicy New Twist on Yield Farming"
      />
      <Container>
        <Card>
          <CardContent>
            <Question
              active={activeSlug === "Flavor-protocol"}
              question="What is Flavor.finance?"
              slug="Flavor-protocol"
            >
              <span>Flavor is a decentralized app that combines a simple prediction market mechanic with high-yield interest earning. The result is an easy way to bet on crypto assets with minimal risk. </span>
              <span>It is built on a custom <a href="https://docs.pooltogether.com/protocol/overview" target="_blank">PoolTogether</a> prize strategy for allocating prize earnings, <a href="https://chain.link" target="_blank">Chainlink</a> price feeds for determining winners, and the <a href="https://yearn.finance/vaults" target="_blank">yUSDC yVault</a> for earning interest on USDC deposits.</span>
            </Question>
            <Question
              active={activeSlug === "work"}
              question="How does it work?"
              slug="work"
            >
              <span>Flavor operates a daily competition, beginning and ending at midnight GMT.</span>
              <span>The <a href="/">flavor.finance</a> website shows a list of crypto assets, and their daily price percentage change in terms of USD value since the beginning of the daily prize period.</span>
              <span>For each one of these assets, you can deposit USDC to a corresponding customized PoolTogether pod contract. The USDC is placed in the yUSDC vault where it earns interest, and you receive a FLAVOR-USDC token that can later be redeemed for USDC.</span>
              <span>At the end of each daily prize period, a Chainlink price feed oracle is used to determine which asset had the greatest percentage change (or least negative change). The corresponding pod contract is awarded all USDC earned during the daily prize period. </span>
              <span>A rebasing mechanism then increases the supply of FLAVOR-USDC tokens for the winning pod to reflect its increased amount of USDC funds, resulting in an increase in the balance of FLAVOR-USDC tokens in the wallets of participants who have deposited to that pod. </span>
            </Question>
            <Question
              active={activeSlug === "Flavor-token"}
              question="What are FLAVOR-USDC tokens?"
              slug="Flavor-usdc-token"
            >
              <span>FLAVOR-USDC tokens are minted and added to your wallet whenever you make a deposit to a Flavor pod contract.</span>
              <span>For example, if you deposit to the Bitcoin/BTC pod contract (and are betting on BTC/USD's relative price performance compared to other supported crypto asseets), you will receive <i>FLAVOR-USDC-BTC</i> tokens once you have deposited USDC.</span>
              <span>Your balance of FLAVOR-USDC tokens are always equivelent to the amount of USDC that you can redeem from the corresponding pod. If you have 100 <i>FLAVOR-USDC-BTC</i> tokens, they can then be used to withdraw 100 USDC tokens from the pod contract.</span>
              <span>When each daily supply rebase occurs, your balance of FLAVOR-USDC tokens will either remain the same or increase if your selected asset won the daily prize period. Because Flavor is "no-loss" and the only thing at stake is earned interest via yUSDC vaults, negative rebases will not occur and you'll always be able to redeem FLAVOR-USDC tokens for at least the amount of USDC that you had deposited.</span>
            </Question>
            <Question
              active={activeSlug === "Flavor-token"}
              question="What is the FLAVOR token?"
              slug="Flavor-token"
            >
              <span>FLAVOR is the governance token for the Flavor protocol. FLAVOR will be automatically farmed by all participants of the Flavor app.</span>
              <span>The launch of FLAVOR farming will abide by strict fair launch principles, with no premining or early access.</span>
              <span>Using token voting, FLAVOR holders have direct influence over the Flavor treasury and direction of the protocol. Governance discussions will take place on the <ExternalLink href="https://forum.flavor.finance/">Flavor Governance Forum.</ExternalLink></span>
              <span>More information will be released soon regarding the Flavor treasury and how it fits into the Flavor system architecture.</span>
            </Question>
            <Question
              active={activeSlug === "fairness"}
              question="How is fairness maintained?"
              slug="fairness"
            >
              <span>Without any considerations made for fairness, participants who deposit into a Flavor pod contract in the minutes or seconds before a prize period ends would have a considerable edge, and we would expect "sniping" by bots to likely become a problem.</span>
              <span>At first, deposits made to a pod during a daily prize period will not be eligible for earnings until the next daily prize period.</span>
              <span>We are also investigating more sophisticated ways of maintaining fairness, including the <a href="https://docs.pooltogether.com/protocol/prize-pool/fairness" target="_blank">PoolTogether credit rate system</a>.</span>
            </Question>
            <Question
              active={activeSlug === "who"}
              question="Who should use Flavor.finance?"
              slug="who"
            >
              <span>While the earning potential from Flavor may not be very exciting to yield farming experts and professional traders, we are very excited about its potential for a mainstream audience who are either not yet using cryoto at all, or have just started to dabble. These are the types of users who generally have a low appetite for risk.</span>
              <span>What we find compelling about the Flavor model is that it is relatively safe and low-risk, but still has a fun and playful twist with its built-in prediction market mechanic.</span>
              <span>Through its FLAVOR-USDC token model, Flavor also produces a new type of positive-rebasing, non-inflationary stablecoin. We are quite curious to further explore the possibilities of these "flavored stablecoins".</span>
            </Question>
            <Question
              active={activeSlug === "when"}
              question="When will Flavor.finance launch?"
              slug="when"
            >
              <span>Soon! Flavor is being developed as part of the <a href="https://hack.ethglobal.co/" target="_blank">ETHGlobal hackathon</a> and will have its first launch in October 2020.</span>
              <span>Follow <a href="https://twitter.com/flavorfinance" target="_blank">@FlavorFinance</a> on Twitter to be notified when Flavor launches.</span>
            </Question>
          </CardContent>
        </Card>
      </Container>
    </Page>
  )
}


export default FAQ
