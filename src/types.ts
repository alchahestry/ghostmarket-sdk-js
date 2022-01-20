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

export interface OrderbookResponse {
  orders: OrderJSON[];
  count: number;
}
