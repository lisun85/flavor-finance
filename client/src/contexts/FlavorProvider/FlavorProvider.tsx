import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Flavor } from 'flavor-sdk/lib'

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
  const [flavor, setFlavor] = useState<any>()

  useEffect(() => {
    if (ethereum) {
      const FlavorLib = new Flavor(
        ethereum,
        "1",
        false, {
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
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
