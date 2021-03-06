import React, { useCallback, useMemo, useState } from 'react'
import { createTheme, ThemeProvider } from 'react-neu'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { UseWalletProvider } from 'use-wallet'

import MobileMenu from 'components/MobileMenu'
import TopBar from 'components/TopBar'

import { AssetPricesProvider } from 'contexts/AssetPrices'
import { BalancesProvider } from 'contexts/Balances'
import { DepositProvider } from 'contexts/Deposit'
import { FarmingProvider } from 'contexts/Farming'
import { MigrationProvider } from 'contexts/Migration'
import { PricesProvider } from 'contexts/Prices'
import { VestingProvider } from 'contexts/Vesting'
import FlavorProvider from 'contexts/FlavorProvider'

import useLocalStorage from 'hooks/useLocalStorage'
import { DEFAULT_NETWORK } from 'flavor-sdk/lib/lib/constants';
import Farm from 'views/Farm'
import FAQ from 'views/FAQ'
import History from 'views/History'
import Home from 'views/Home'
import Funds from 'views/Funds'

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (
    <Router>
      <Providers>
        <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <FAQ />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          {/*
          <Route exact path="/farm">
            <Farm />
          </Route>
          <Route exact path="/funds">
            <Funds />
          </Route>
          */}
        </Switch>
      </Providers>
    </Router>
  )
}

const Providers: React.FC = ({ children }) => {
  const [darkModeSetting] = useLocalStorage('darkMode', false)
  const { dark: darkTheme, light: lightTheme } = useMemo(() => {
    return createTheme({
      baseColor: { h: 10, s: 100, l: 41 },
      baseColorDark: { h: 339, s: 89, l: 49 },
      borderRadius: 28,
    })
  }, [])
  return (
    <ThemeProvider
      darkModeEnabled={darkModeSetting}
      darkTheme={darkTheme}
      lightTheme={lightTheme}
    >
      <UseWalletProvider
        chainId={DEFAULT_NETWORK}
        connectors={{
          walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
        }}
      >
        <FlavorProvider>
          <PricesProvider>
              <DepositProvider>
                <BalancesProvider>
                    <AssetPricesProvider>
                      <MigrationProvider>
                        <VestingProvider>
                          {children}
                        </VestingProvider>
                      </MigrationProvider>
                    </AssetPricesProvider>
                </BalancesProvider>
            </DepositProvider>
        </PricesProvider>
        </FlavorProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

export default App
