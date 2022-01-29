import 'isomorphic-unfetch';
import * as QueryString from 'query-string';
import {
  DEFAULT_NETWORK,
  API_BASE_MAINNET,
  API_BASE_RINKEBY,
  API_PATH,
  SITE_HOST_MAINNET,
  SITE_HOST_RINKEBY,
} from './constants';
import {
  CollectionsQuery,
  GhostMarketAPIConfig,
  Network,
  OrderQuery,
  UsersQuery,
} from './types';

export class GhostMarketAPI {
  /**
   * Host url for GhostMarket
   */
  public readonly hostUrl: string;

  /**
   * Base url for the API
   */
  public readonly apiBaseUrl: string;

  /**
   * Logger function to use when debugging
   */
  public logger: (arg: string) => void;

  /**
   * Page size to use for fetching orders
   */
  public pageSize = 20;

  private apiKey: string | undefined;

  public static DEFAULT_NETWORK = DEFAULT_NETWORK;
  // public static TokenClient = TokenClient
  // network: Network;

  // configOverride: Partial<NetworkConfig>;

  // token: TokenClient;

  // neo: NEOClient;
  // eth: ETHClient;
  // bsc: ETHClient;

  constructor(config: GhostMarketAPIConfig, logger?: (arg: string) => void) {
    this.apiKey = config.apiKey;

    switch (config.networkName) {
      case Network.Rinkeby:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_RINKEBY;
        this.hostUrl = SITE_HOST_RINKEBY;
        break;
      case Network.Main:
      default:
        this.apiBaseUrl = config.apiBaseUrl || API_BASE_MAINNET;
        this.hostUrl = SITE_HOST_MAINNET;
        break;
    }

    // Debugging: default to nothing
    this.logger = logger || ((arg: string) => arg);
  }

  /** Get NFT collection available on the GhostMarket marketplace, throwing if none is found.
   * @param query Query to use for getting users.
   */
  public async getCollections(
    query: CollectionsQuery = {},
    offset: number = 0,
    order_by: string = 'id',
    order_direction: string = 'asc',
    with_total: number = 1,
    limit: number = 50,
  ): Promise<Record<string, unknown>> {
    console.log('Inside getCollections!');
    const result = await this.get(`${API_PATH}/collections/`, {
      limit: limit,
      offset: offset,
      ...query,
    });

    const json = result as Record<string, unknown>;
    return json;
  }

  /** Get users from the GhostMarket userbase API, throwing if none is found.
   * @param query Query to use for getting users.
   */
  public async getUsers(
    query: UsersQuery = {},
    offset: number = 0,
    order_by: string = 'join_order',
    order_direction: string = 'asc',
    with_sales_statistics: number = 0,
    with_total: number = 0,
    limit: number = 50,
  ): Promise<Record<string, unknown>> {
    console.log('Inside getUsers!');
    const result = await this.get(`${API_PATH}/users/`, {
      limit: limit,
      offset: offset,
      ...query,
    });

    const json = result as Record<string, unknown>;
    return json;
  }

  /** Check if user exists on GhostMarket, returns True or False.
   * @param username Check if this username already exists on GhostMarket.
   */
  public async getCheckUserExists(
    username: string,
  ): Promise<Record<string, unknown>> {
    console.log('Inside getCheckUserExists!');
    const result = await this.get(`${API_PATH}/userexists/`, {
      username: username,
    });
  
    const json = result as Record<string, unknown>;
    return json;
  }

  /** Get orders from the orderbook, throwing if none is found.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `OrderJSON` type is supported
   */
  public async getOrders(
    query: OrderQuery = {},
    page = 1,
  ): Promise<Record<string, unknown>> {
    console.log('Inside getOrders!');
    const result = await this.get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ...query,
    });

    const json = result as Record<string, unknown>;
    return json;
  }

  /** Get order from the orderbook, throwing if none is found.
   * @param query Query to use for getting orders. A subset of parameters
   *  on the `OrderJSON` type is supported
   */
  public async getOrder(
    query: OrderQuery = {},
    page = 1,
  ): Promise<Record<string, unknown>> {
    console.log('Inside getOrders!');
    const result = await this.get(`${API_PATH}/openorders/`, {
      limit: this.pageSize,
      offset: (page - 1) * this.pageSize,
      ...query,
    });

    const json = result as Record<string, unknown>;
    return json;
  }

  /**
   * Get JSON data from API, sending auth token in headers
   * @param apiPath Path to URL endpoint under API
   * @param query Data to send. Will be stringified using QueryString
   */
  public async get<T>(apiPath: string, query: object = {}): Promise<T> {
    const qs = QueryString.stringify(query);
    const url = `${apiPath}?${qs}`;

    const response = await this._fetch(url);
    return response.json();
  }

  /**
   * Get from an API Endpoint, sending auth token in headers
   * @param apiPath Path to URL endpoint under API
   * @param opts RequestInit opts, similar to Fetch API
   */
  private async _fetch(apiPath: string, opts: RequestInit = {}) {
    const apiBase = this.apiBaseUrl;
    const apiKey = this.apiKey;
    const finalUrl = apiBase + apiPath;
    const finalOpts = {
      ...opts,
      headers: {
        ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
        ...(opts.headers || {}),
      },
    };

    this.logger(
      `Sending request: ${finalUrl} ${JSON.stringify(finalOpts).substr(0, 100)}...`,
    );

    return fetch(finalUrl, finalOpts).then(async (res) => this._handleApiResponse(res));
  }

  private async _handleApiResponse(response: Response) {
    if (response.ok) {
      this.logger(`Got success: ${response.status}`);
      return response;
    }

    let result;
    let errorMessage;
    try {
      result = await response.text();
      result = JSON.parse(result);
    } catch {
      // Result will be undefined or text
    }

    this.logger(`Got error ${response.status}: ${JSON.stringify(result)}`);

    switch (response.status) {
      case 400:
        errorMessage =
          result && result.errors
            ? result.errors.join(', ')
            : `Invalid request: ${JSON.stringify(result)}`;
        break;
      case 401:
      case 403:
        errorMessage = `Unauthorized. Full message was '${JSON.stringify(
          result,
        )}'`;
        break;
      case 404:
        errorMessage = `Not found. Full message was '${JSON.stringify(
          result,
        )}'`;
        break;
      case 500:
        errorMessage = `Internal server error. Ghost Market has been alerted, but if the problem persists please contact us via Discord: https://discord.gg/ga8EJbv - full message was ${JSON.stringify(
          result,
        )}`;
        break;
      case 503:
        errorMessage = `Service unavailable. Please try again in a few minutes. If the problem persists please contact us via Discord: https://discord.gg/ga8EJbv - full message was ${JSON.stringify(
          result,
        )}`;
        break;
      default:
        errorMessage = `Message: ${JSON.stringify(result)}`;
        break;
    }

    throw new Error(`API Error ${response.status}: ${errorMessage}`);
  }
}
