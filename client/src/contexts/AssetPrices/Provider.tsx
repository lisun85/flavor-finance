import React, { useCallback, useEffect, useState } from 'react'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const [assets, setAssets] = useState<Array<any>>([])

  const fetchAssets = useCallback(() => {
    const baseURI = window.location.href.includes('localhost')
      ? 'http://localhost:8080'
      : '';
    fetch(`${baseURI}/api/assetPrices`)
   .then(resp => resp.json())
   .then(data => setAssets(data.results))
  }, [])


  return (
    <Context.Provider value={{
      assets,
      fetchAssets
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider
