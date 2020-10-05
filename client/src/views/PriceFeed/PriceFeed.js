import React, { useState, useEffect } from 'react'
import {
  Container,
  Spacer,
  useTheme,
} from 'react-neu'
import Page from 'components/Page'
import PageHeader from 'components/PageHeader'
import styled from 'styled-components'
import Web3 from 'web3'
import { aggregatorV3InterfaceAbi, priceConsumerAbi} from "./assets/eth_price_feed_abi"
import SNXPriceConsumerAbi from "./assets/snx_price_feed"

const web3 = new Web3("https://kovan.infura.io/v3/8cea41dbf6cc45f687f3544db79ddcb6")

// price feed address
const ETHAddr = "0x191E50Aa2756E06D2b67cC460570fCa138819Dc1"
const SNXAddr = "0x6dC7CAEf968B205c2DEBa035E3A3230a97d6C86E"

// set-up contract instance
const ETHPriceConsumer = new web3.eth.Contract(priceConsumerAbi, ETHAddr)

const SNXPriceConsumer = new web3.eth.Contract(SNXPriceConsumerAbi, SNXAddr)



const PriceFeed = () => {
  const [latestPrice, setLatestPrice] = useState(0)
  const [SNXPrice, setSNXPrice] = useState(0)

  const getPrice = () => {
    ETHPriceConsumer.methods.getLatestPrice().call()
    .then(price => {
      console.log("price : ", price);
      setLatestPrice(price/100000000)
    })
    .catch(err => {
      console.log("err : ", err)
    })
  }

  const getSNXPrice = () => {
    console.log("SNXPriceConsumer : ", SNXPriceConsumer)
    SNXPriceConsumer.methods.getLatestPrice().call()
    .then(price => {
      console.log("price : ", price);
      setSNXPrice(price)
    })
    .catch(err => {
      console.log("err : ", err)
    })
  }




  useEffect(() => {
    ETHPriceConsumer.methods.getLatestPrice().call()
    .then(price => {
      console.log("price : ", price);
      setLatestPrice(price/100000000)
    })
    .catch(err => {
      console.log("err : ", err)
    })

  }, [])


  return (
    <Page>
      <PageHeader
        icon=""
        title="🌶️ &nbsp; A Spicy New Twist on Yield Farming &nbsp; 🌶️"
      />
      <Container>

        <div className="get-price" onClick={getPrice}>get latest ETH price</div>
        <Spacer />
        <div className="latest-price">latest ETH price : {latestPrice}</div>

                
        <div className="get-price" onClick={getSNXPrice}>get latest SNX price</div>
        <Spacer />
        <div className="latest-price">latest SNX price : {SNXPrice}</div>

      </Container>
    </Page>
  )
}

export default PriceFeed
