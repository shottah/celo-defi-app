import { Interface } from '@ethersproject/abi';
import { ChainId, Token, CELO } from '@ubeswap/sdk';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { filter, flatMap, keyBy, map, toLower } from 'lodash';
import { DAI_ADDRESS, USDC_ADDRESS } from '../';
import RAINBOW_TOKEN_LIST_DATA from '../ubeswap/ubeswap.token-list.json';
import MULTICALL_ABI from './uniswap-multicall-abi.json';

import { default as UNISWAP_TESTNET_TOKEN_LIST } from './uniswap-pairs-testnet.json';
import { abi as UNISWAP_V2_ROUTER_ABI } from './uniswap-v2-router.json';
import UNISWAP_V1_EXCHANGE_ABI from './v1-exchange-abi';
import { RainbowToken } from '@rainbow-me/entities';

const tokenList: RainbowToken[] = map(RAINBOW_TOKEN_LIST_DATA.tokens, token => {
  const { address: rawAddress, decimals, name, symbol } = token;
  const address = toLower(rawAddress);
  return {
    address,
    decimals,
    name,
    symbol,
    uniqueId: address,
  };
});

const ethWithAddress: RainbowToken = {
  address: 'celo',
  decimals: 18,
  isRainbowCurated: true,
  isVerified: true,
  name: 'celo',
  symbol: 'CELO',
  uniqueId: 'celo',
};

const tokenListWithEth: RainbowToken[] = [ethWithAddress, ...tokenList];

const RAINBOW_TOKEN_LIST: Record<string, RainbowToken> = keyBy(
  tokenListWithEth,
  'address'
);

// TODO: Unused, as the Ubeswap Token list does not specify this.
// const curatedRainbowTokenList: RainbowToken[] = filter(
//   tokenListWithEth,
//   'isRainbowCurated'
// );

const TOKEN_SAFE_LIST: Record<string, string> = keyBy(
  flatMap(tokenListWithEth, ({ name, symbol }) => [name, symbol]),
  id => toLower(id)
);

const CURATED_UNISWAP_TOKENS: Record<string, RainbowToken> = keyBy(
  tokenListWithEth,
  'address'
);

const UNISWAP_V2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const UNISWAP_V2_BASES = {
  [ChainId.MAINNET]: [
    CELO[ChainId.MAINNET],
    new Token(ChainId.MAINNET, DAI_ADDRESS, 18, 'DAI', 'Dai Stablecoin'),
    new Token(ChainId.MAINNET, USDC_ADDRESS, 6, 'USDC', 'USD//C'),
  ],
  [ChainId.ALFAJORES]: [CELO[ChainId.ALFAJORES]],
  [ChainId.BAKLAVA]: [CELO[ChainId.BAKLAVA]],
};

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);
const PAIR_GET_RESERVES_FRAGMENT = PAIR_INTERFACE.getFunction('getReserves');
const PAIR_GET_RESERVES_CALL_DATA: string = PAIR_INTERFACE.encodeFunctionData(
  PAIR_GET_RESERVES_FRAGMENT
);

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  // TODO: Replace the following contracts with
  // multi-call contracts on the respective networks
  // that can do simple operations on the blockchain.
  [ChainId.MAINNET]: '0x75f59534dd892c1f8a7b172d639fa854d529ada3',
  [ChainId.ALFAJORES]: '0x75f59534dd892c1f8a7b172d639fa854d529ada3',
  [ChainId.BAKLAVA]: '0x75f59534dd892c1f8a7b172d639fa854d529ada3',

  // [ChainId.Alfajores]: '0x75f59534dd892c1f8a7b172d639fa854d529ada3',
  // [ChainId.Baklava]: '0x75f59534dd892c1f8a7b172d639fa854d529ada3',

  // [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  // [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  // [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  // [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  // [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
};

export {
  CURATED_UNISWAP_TOKENS,
  MULTICALL_ABI,
  MULTICALL_NETWORKS,
  PAIR_GET_RESERVES_CALL_DATA,
  PAIR_GET_RESERVES_FRAGMENT,
  PAIR_INTERFACE,
  RAINBOW_TOKEN_LIST,
  TOKEN_SAFE_LIST,
  UNISWAP_TESTNET_TOKEN_LIST,
  UNISWAP_V1_EXCHANGE_ABI,
  UNISWAP_V2_BASES,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_ROUTER_ADDRESS,
};
