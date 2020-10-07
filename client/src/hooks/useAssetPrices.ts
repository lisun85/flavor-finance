import { useContext } from 'react'

import { AssetPricesContext } from 'contexts/AssetPrices'

const useAssetPrices = () => {
  return { ...useContext(AssetPricesContext) }
}

export default useAssetPrices
