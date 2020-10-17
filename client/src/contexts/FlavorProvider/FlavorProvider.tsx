import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Flavor as FlavorSDK } from 'flavor-sdk/lib'
import { DEFAULT_NETWORK } from 'flavor-sdk/lib/lib/constants';

export interface FlavorContext {
  Flavor?: any
}

export const Context = createContext<FlavorContext>({
  Flavor: undefined,
})

declare global {
  interface Window {
    Flavorsauce: any
  }
}

const FlavorProvider: React.FC = ({ children }) => {
  const { ethereum } = useWallet()
  const [Flavor, setFlavor] = useState<any>()
  const IS_TESTING = false
  useEffect(() => {
    if (ethereum) {
      const FlavorLib = new FlavorSDK(
        ethereum,
        DEFAULT_NETWORK,
        IS_TESTING, {
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: IS_TESTING,
          defaultGas: "6000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        }
      )
      setFlavor(FlavorLib)
      window.Flavorsauce = FlavorLib
    }
  }, [ethereum])

  return (
    <Context.Provider value={{ Flavor }}>
      {children}
    </Context.Provider>
  )
}

export default FlavorProvider
