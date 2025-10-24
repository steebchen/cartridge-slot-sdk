import { GraphQLClient } from 'graphql-request';
import { CREATE_DEPLOYMENT, UPDATE_DEPLOYMENT } from './operations';

export interface SlotClientConfig {
  apiUrl?: string;
  authToken: string;
}

export interface CreateDeploymentInput {
  project: string;
  service: CreateServiceInput;
  tier: DeploymentTier;
  wait?: boolean;
  regions?: string[];
  team?: string;
}

export interface UpdateDeploymentInput {
  project: string;
  service: UpdateServiceInput;
  tier?: DeploymentTier;
  wait?: boolean;
}

export interface CreateServiceInput {
  katana?: KatanaConfig;
  torii?: ToriiConfig;
}

export interface UpdateServiceInput {
  katana?: KatanaConfig;
  torii?: ToriiConfig;
}

export interface KatanaConfig {
  blockTime?: number;
  forkRpcUrl?: string;
  forkBlockNumber?: number;
  accounts?: number;
  disableFee?: boolean;
  seed?: string;
  maxSteps?: number;
}

export interface ToriiConfig {
  worldAddress: string;
  rpc: string;
  startBlock?: number;
  indexPending?: boolean;
  indexTransactions?: boolean;
  indexRawEvents?: boolean;
}

export enum DeploymentTier {
  BASIC = 'BASIC',
  HOBBY = 'HOBBY',
  PRO = 'PRO',
  EPIC = 'EPIC'
}

export interface DeploymentResponse {
  __typename: string;
  id: string;
  version: number;
  config: {
    configFile: string;
  };
}

export interface CreateDeploymentResponse {
  createDeployment: DeploymentResponse;
}

export interface UpdateDeploymentResponse {
  updateDeployment: DeploymentResponse;
}

export class SlotClient {
  private client: GraphQLClient;

  constructor(config: SlotClientConfig) {
    const apiUrl = config.apiUrl || 'https://api.cartridge.gg/query';

    this.client = new GraphQLClient(apiUrl, {
      headers: {
        authorization: `Bearer ${config.authToken}`,
      },
    });
  }

  /**
   * Create a new deployment (Katana or Torii service)
   */
  async createDeployment(input: CreateDeploymentInput): Promise<DeploymentResponse> {
    const response = await this.client.request<CreateDeploymentResponse>(
      CREATE_DEPLOYMENT,
      {
        project: input.project,
        service: input.service,
        tier: input.tier,
        wait: input.wait,
        regions: input.regions,
        team: input.team,
      }
    );

    return response.createDeployment;
  }

  /**
   * Update an existing deployment
   */
  async updateDeployment(input: UpdateDeploymentInput): Promise<DeploymentResponse> {
    const response = await this.client.request<UpdateDeploymentResponse>(
      UPDATE_DEPLOYMENT,
      {
        project: input.project,
        service: input.service,
        tier: input.tier,
        wait: input.wait,
      }
    );

    return response.updateDeployment;
  }
}
