import { useContext } from 'react'

import { DepositContext } from 'contexts/Deposit'

const useDeposit = () => {
  return { ...useContext(DepositContext) }
}

export default useDeposit
