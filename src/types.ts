/**
 * @param Main Ethereum mainnet
 * @param Rinkeby Ethereum Rinkeby testnet
 */
export enum Network {
  Main = 'main',
  Rinkeby = 'rinkeby',
}

/**
 * OpenSea API configuration object
 * @param apiKey Optional key to use for API
 * @param networkName `Network` type to use. Defaults to `Network.Main` (mainnet)
 * @param gasPrice Default gas price to send to the Wyvern Protocol
 * @param apiBaseUrl Optional base URL to use for the API
 */
export interface GhostMarketAPIConfig {
  networkName?: Network;
  apiKey?: string;
  apiBaseUrl?: string;
  useReadOnlyProvider?: boolean;
}

export interface Order {
  id: number;
  chain: string;
  token_contract: string;
  token_id: string;
  token_amount: string;
  quote_contract: string;
  quote_price: string;
  maker_address: string;
  start_date: string;
  end_date: string;
  signature: string;
  order_key_hash: string;
  salt: string;
  origin_fees: string;
  origin_address: string;
}

/**
 * Query interface for Orders
 */
export interface OrderQuery {
  chain?: string;
  contract?: string;
  token_id?: string;
  offset?: number | string;
  limit?: number;
  with_deleted?: boolean;
}

/**
 * Order attributes, including orderbook-specific query options
 * See https://docs.opensea.io/reference#retrieving-orders for the full
 * list of API query parameters and documentation.
 */
export interface OrderJSON {
  id: number;
  chain: string;
  token_contract: string;
  token_id: string;
  token_amount: string;
  quote_contract: string;
  quote_price: string;
  maker_address: string;
  start_date: string;
  end_date: string;
  signature: string;
  order_key_hash: string;
  salt: string;
  origin_fees: string;
  origin_address: string;
}

/**
 * Query interface for Assets
 */
export interface AssetsQuery {
  auction_started?: string;
  auction_state?: string;
  auction_type?: string;
  bidder?: string;
  chain?: string;
  chain_name?: string;
  collection_slug?: string;
  contract?: string;
  contract_id?: string;
  creator?: string;
  fiat_currency?: string;
  filter1name?: string;
  filter1value?: string;
  filter2name?: string;
  filter2value?: string;
  filter3name?: string;
  filter3value?: string;
  filter4name?: string;
  filter4value?: string;
  filter5name?: string;
  filter5value?: string;
  grouping?: number;
  issuer?: string;
  light_mode?: number;
  limit?: number;
  maker?: string;
  name?: string;
  nsfw_mode?: string;
  offset?: number;
  only_verified?: number;
  order_by?: string;
  order_direction?: string;
  owner?: string;
  price_similar?: number;
  price_similar_delta?: number;
  quote_symbol?: string;
  series_id?: string;
  status?: string;
  symbol?: string;
  token_id?: string;
  with_total?: number;
}

/**
 * Query interface for Collections
 */
export interface CollectionsQuery {
  chain?: string;
  collection_slug?: string;
  issuer?: string;
  limit?: number;
  nft_name?: string;
  offset?: number;
  order_by?: string;
  order_direction?: string;
  owner?: string;
  quote_symbol?: string;
  series_id?: string;
  with_total?: number;
}

export interface OrderbookResponse {
  orders: OrderJSON[];
  count: number;
}

/**
 * Query interface for Users
 */
export interface UsersQuery {
  address?: string;
  chain?: string;
  issuer?: string;
  limit?: number;
  offchain_name?: string;
  offchain_name_partial?: string;
  offset?: number;
  order_by?: string;
  order_direction?: string;
  verified?: boolean;
  with_sales_statistics?: number;
  with_total?: number;
}

/**
 * Query interface for Series
 */
export interface SeriesQuery {
  chain?: string;
  contract?: string;
  creator?: string;
  id?: string;
  limit?: number;
  name?: string;
  offset?: number;
  order_by?: string;
  order_direction?: string;
  symbol?: string;
}
