import { useContext } from 'react'
import { Context } from '../contexts/FlavorProvider'

const useFlavor = () => {
  const { Flavor } = useContext(Context)
  return Flavor
}

export default useFlavor