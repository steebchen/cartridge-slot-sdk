# Cartridge Slot TypeScript SDK

Unofficial TypeScript client for the Cartridge Slot GraphQL API with full type safety.

## Installation

```bash
npm i cartridge-slot-sdk
```

## Examples

Check out the [usage example](./examples/usage.ts) to get started.

## Usage

```typescript
import { SlotClient, DeploymentTier } from 'cartridge-slot-sdk';

// Initialize the client
const client = new SlotClient({
  authToken: 'your-auth-token',
  apiUrl: 'https://api.cartridge.gg/query' // optional
});

// Create a Katana deployment
const deployment = await client.createDeployment({
  project: 'my-project',
  tier: DeploymentTier.Basic,
  service: {
    katana: {
      blockTime: 1000,
      accounts: 10,
      disableFee: true
    }
  },
  wait: true
});

console.log('Deployment created:', deployment.id);

// Create a Torii deployment
const toriiDeployment = await client.createDeployment({
  project: 'my-torii-project',
  tier: DeploymentTier.Hobby,
  service: {
    torii: {
      config: `world_address = "0x585a28495ca41bece7640b0ccf2eff199ebe70cc381fa73cb34cc5721614fbd"
rpc = "https://api.cartridge.gg/x/starknet/sepolia"`,
    },
  },
  wait: true,
});

console.log('Torii Deployment created:', toriiDeployment.id);

// Update a deployment
const updated = await client.updateDeployment({
  project: 'my-project',
  service: {
    katana: {
      blockTime: 2000
    }
  },
  tier: DeploymentTier.Pro
});

console.log('Deployment updated:', updated.version);
```

## API

### `SlotClient`

#### Constructor

```typescript
new SlotClient(config: SlotClientConfig)
```

- `config.authToken` (required): Authentication token from `slot auth token`
- `config.apiUrl` (optional): API endpoint URL (defaults to https://api.cartridge.gg/query)

#### Methods

##### `createDeployment(input: CreateDeploymentInput): Promise<DeploymentResponse>`

Create a new Katana or Torii deployment.

Parameters:
- `project`: Deployment name
- `service`: Service configuration (katana or torii)
- `tier`: Deployment tier (BASIC, HOBBY, PRO, EPIC)
- `wait` (optional): Wait for deployment to be ready
- `regions` (optional): Deployment regions
- `team` (optional): Team name

##### `updateDeployment(input: UpdateDeploymentInput): Promise<DeploymentResponse>`

Update an existing deployment.

Parameters:
- `project`: Deployment name
- `service`: Service configuration to update
- `tier` (optional): New deployment tier
- `wait` (optional): Wait for update to complete

## Types

### `KatanaConfig`

```typescript
{
  blockTime?: number;
  forkRpcUrl?: string;
  forkBlockNumber?: number;
  accounts?: number;
  disableFee?: boolean;
  seed?: string;
  maxSteps?: number;
}
```

### `ToriiConfig`

```typescript
{
  worldAddress: string;
  rpc: string;
  startBlock?: number;
  indexPending?: boolean;
  indexTransactions?: boolean;
  indexRawEvents?: boolean;
}
```

### `DeploymentTier`

```typescript
enum DeploymentTier {
  BASIC = 'BASIC',
  HOBBY = 'HOBBY',
  PRO = 'PRO',
  EPIC = 'EPIC'
}
```
