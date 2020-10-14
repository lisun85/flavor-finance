import React, { useCallback, useEffect, useState } from 'react'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const [assets, setAssets] = useState<Array<any>>([])
  const [history, setHistory] = useState<Array<any>>([])

  const fetchAssets = useCallback(() => {
    const baseURI = window.location.href.includes('localhost')
      ? 'http://localhost:8080'
      : '';
    fetch(`${baseURI}/api/assetPrices`)
   .then(resp => resp.json())
   .then(data => setAssets(data.results))
  }, [])


  const fetchHistory = useCallback(() => {
    const baseURI = window.location.href.includes('localhost')
      ? 'http://localhost:8080'
      : '';
    fetch(`${baseURI}/api/history`)
   .then(resp => resp.json())
   .then(data => setHistory(data.results))
  }, [])


  return (
    <Context.Provider value={{
      assets,
      fetchAssets,
      history,
      fetchHistory,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider
