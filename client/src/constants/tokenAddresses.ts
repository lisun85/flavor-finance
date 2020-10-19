import { NETWORKS, DEFAULT_NETWORK } from 'flavor-sdk/lib/lib/constants';

export const Flavor = '0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16'
export const Flavorv2 = '0xaba8cac6866b83ae4eec97dd07ed254282f6ad8a'
export const Flavorv3 = '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521'

export const yUsd = '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c'
export const yycrvUniLp = '0xb93Cc05334093c6B3b8Bfd29933bb8d5C031caBC'
export const migrator = '0x72cfed9293cbfb2bfc7515c413048c697c6c811c'


// Use https://erc20faucet.com/ to mint testnet tokens
export const USDCTokens = {
  [NETWORKS.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [NETWORKS.KOVAN]: '0xFab46E002BbF0b4509813474841E0716E6730136'
}
export const usdc = USDCTokens[DEFAULT_NETWORK]

export const FlavorTokensByNetwork = {
  [NETWORKS.MAINNET]:{
    'BTC': '0x6F5587E191C8b222F634C78111F97c4851663ba4',
    'ETH': '0x6F5587E191C8b222F634C78111F97c4851663ba4',
    'SDEFI': '0x6F5587E191C8b222F634C78111F97c4851663ba4'
  },
  [NETWORKS.KOVAN]:{
    'BTC': '0x9191Fd9f29cbbE73bA0e1B8959eC89Bc780e598b',
    'ETH': '0x9191Fd9f29cbbE73bA0e1B8959eC89Bc780e598b',
    'SDEFI': '0x9191Fd9f29cbbE73bA0e1B8959eC89Bc780e598b'
  }
}

export const FlavorTokens = FlavorTokensByNetwork[DEFAULT_NETWORK]
