import React, { useCallback, useEffect, useState } from 'react'

import useFlavor from 'hooks/useFlavor'
import { bnToDec } from 'utils'
import { getCurrentPrice } from 'flavor-sdk/utils'

import PricesContext from './PricesContext'

const PricesProvider: React.FC = ({ children }) => {
  const [FlavorTwap, setFlavorTwap] = useState<number>()
  const Flavor = useFlavor()

  const fetchCurrentPrice = useCallback(async () => {
    if (!Flavor) return
    const price = await getCurrentPrice(Flavor)
    setFlavorTwap(bnToDec(price))
  }, [setFlavorTwap, Flavor])

  useEffect(() => {
    fetchCurrentPrice()
    let refreshInterval = setInterval(fetchCurrentPrice, 10000)
    return () => clearInterval(refreshInterval)
  }, [fetchCurrentPrice])
  
  return (
    <PricesContext.Provider value={{
      FlavorTwap,
    }}>
      {children}
    </PricesContext.Provider>
  )
}

export default PricesProvider