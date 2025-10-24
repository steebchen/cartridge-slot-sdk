import { GraphQLClient } from 'graphql-request';
import { CREATE_DEPLOYMENT, UPDATE_DEPLOYMENT, DELETE_DEPLOYMENT } from './operations';
import { DeploymentService, DeploymentTier } from './generated/graphql';

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
  team: string;
}

export interface UpdateDeploymentInput {
  project: string;
  service: UpdateServiceInput;
  tier?: DeploymentTier;
  wait?: boolean;
}

export interface CreateServiceInput {
  katana?: {
    config: string; // TOML config string
  };
  torii?: {
    config: string; // TOML config string
  };
}

export interface UpdateServiceInput {
  katana?: {
    config: string; // TOML config string
  };
  torii?: {
    config: string; // TOML config string
  };
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
   * Base64 encode a string
   */
  private base64Encode(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  /**
   * Prepare service input for GraphQL mutation
   */
  private prepareServiceInput(service: CreateServiceInput): { type: DeploymentService; config: string; katana?: any; torii?: any } {
    if (service.katana) {
      return {
        type: DeploymentService.Katana,
        config: this.base64Encode(service.katana.config),
        katana: {},
      };
    } else if (service.torii) {
      return {
        type: DeploymentService.Torii,
        config: this.base64Encode(service.torii.config),
        torii: {},
      };
    }
    throw new Error('Service must specify either katana or torii configuration');
  }

  /**
   * Prepare update service input for GraphQL mutation
   */
  private prepareUpdateServiceInput(service: UpdateServiceInput): { type: DeploymentService; config?: string; torii?: any } {
    if (service.katana) {
      return {
        type: DeploymentService.Katana,
        config: this.base64Encode(service.katana.config),
      };
    } else if (service.torii) {
      return {
        type: DeploymentService.Torii,
        config: this.base64Encode(service.torii.config),
        torii: {},
      };
    }
    throw new Error('Service must specify either katana or torii configuration');
  }

  /**
   * Create a new deployment (Katana or Torii service)
   */
  async createDeployment(input: CreateDeploymentInput): Promise<DeploymentResponse> {
    const preparedService = this.prepareServiceInput(input.service);

    const response = await this.client.request<CreateDeploymentResponse>(
      CREATE_DEPLOYMENT,
      {
        project: input.project,
        service: preparedService,
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
    const preparedService = this.prepareUpdateServiceInput(input.service);

    const response = await this.client.request<UpdateDeploymentResponse>(
      UPDATE_DEPLOYMENT,
      {
        project: input.project,
        service: preparedService,
        tier: input.tier,
        wait: input.wait,
      }
    );

    return response.updateDeployment;
  }

  /**
   * Delete an existing deployment
   */
  async deleteDeployment(project: string, service: 'katana' | 'torii'): Promise<boolean> {
    const serviceType = service === 'katana' ? DeploymentService.Katana : DeploymentService.Torii;

    const response = await this.client.request<{ deleteDeployment: boolean }>(
      DELETE_DEPLOYMENT,
      {
        name: project,
        service: serviceType,
      }
    );

    return response.deleteDeployment;
  }
}
