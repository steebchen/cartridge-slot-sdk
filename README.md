# Cartridge Slot TypeScript Client

TypeScript client for the Cartridge Slot GraphQL API with full type safety.

## Installation

```bash
pnpm install
```

## Setup

The package uses GraphQL Code Generator to create types from the schema:

```bash
# Generate types from schema.json
pnpm generate

# Build the TypeScript code
pnpm build
```

## Usage

```typescript
import { SlotClient, DeploymentTier } from '@cartridge/slot-client';

// Initialize the client
const client = new SlotClient({
  authToken: 'your-auth-token',
  apiUrl: 'https://api.cartridge.gg/query' // optional
});

// Create a Katana deployment
const deployment = await client.createDeployment({
  project: 'my-project',
  tier: DeploymentTier.BASIC,
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

// Update a deployment
const updated = await client.updateDeployment({
  project: 'my-project',
  service: {
    katana: {
      blockTime: 2000
    }
  },
  tier: DeploymentTier.PRO
});

console.log('Deployment updated:', updated.version);
```

## API

### `SlotClient`

#### Constructor

```typescript
new SlotClient(config: SlotClientConfig)
```

- `config.authToken` (required): Authentication token from `slot auth login`
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
