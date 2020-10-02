import { createContext } from 'react'

interface PricesContextValues {
  FlavorTwap?: number
}

const PricesContext = createContext<PricesContextValues>({})

export default PricesContext