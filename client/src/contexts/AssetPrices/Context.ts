import { createContext } from 'react'

import { ContextValues } from './types'

const Context = createContext<ContextValues>({
  assets: [],
  fetchAssets: () => {},
  fetchHistory: () => {},
  history: []
})

export default Context
