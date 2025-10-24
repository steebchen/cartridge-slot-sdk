# Cartridge Slot TypeScript Client - Setup Guide

## Overview

This package provides a fully typed TypeScript client for the Cartridge Slot GraphQL API. It includes:

- ✅ Full TypeScript type safety
- ✅ GraphQL schema validation (no runtime errors)
- ✅ Auto-generated types from remote schema
- ✅ Simple, clean API for `createDeployment` and `updateDeployment`

## Project Structure

```
js/
├── src/
│   ├── client.ts          # Main SlotClient class
│   ├── operations.ts       # GraphQL operations (queries/mutations)
│   ├── index.ts           # Public API exports
│   └── generated/         # Auto-generated types (do not edit)
├── examples/
│   ├── simple-test.ts     # Type validation test
│   └── usage.ts           # Full usage examples
├── codegen.ts             # GraphQL codegen configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
cd js
pnpm install
```

This will automatically:
1. Install all dependencies
2. Generate TypeScript types from the GraphQL schema
3. Build the project

## Development

### Generate types from schema

```bash
pnpm generate
```

This fetches the schema from `https://raw.githubusercontent.com/cartridge-gg/slot/refs/heads/main/slot/schema.json` and generates TypeScript types in `src/generated/`.

### Build the project

```bash
pnpm build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Run tests

```bash
pnpm test
```

Validates that all types are correct and the client structure works.

### Run examples

```bash
# Set your auth token (get it from: slot auth login)
export SLOT_AUTH_TOKEN="your-token-here"

# Run the usage example
pnpm example
```

## Usage

### Basic Example

```typescript
import { SlotClient, DeploymentTier } from '@cartridge/slot-client';

const client = new SlotClient({
  authToken: 'your-auth-token',
});

// Create a Katana deployment
const deployment = await client.createDeployment({
  project: 'my-project',
  tier: DeploymentTier.BASIC,
  service: {
    katana: {
      blockTime: 1000,
      accounts: 10,
      disableFee: true,
    },
  },
  wait: true,
});

console.log('Deployment ID:', deployment.id);
```

### Exported Functions

The package exports two main functions:

#### 1. `createDeployment(input: CreateDeploymentInput): Promise<DeploymentResponse>`

Creates a new Katana or Torii deployment.

**Parameters:**
- `project` (string, required): Name of the deployment
- `service` (CreateServiceInput, required): Service configuration
  - `katana`: Katana sequencer configuration
  - `torii`: Torii indexer configuration
- `tier` (DeploymentTier, required): Performance tier (BASIC, HOBBY, PRO, EPIC)
- `wait` (boolean, optional): Wait for deployment to be ready
- `regions` (string[], optional): Deployment regions
- `team` (string, optional): Team name for team deployments

**Example:**
```typescript
const deployment = await client.createDeployment({
  project: 'my-game',
  tier: DeploymentTier.PRO,
  service: {
    katana: {
      blockTime: 1000,
      accounts: 10,
      disableFee: true,
      seed: 'my-seed',
    },
  },
  regions: ['us-east-1', 'eu-west-1'],
  wait: true,
});
```

#### 2. `updateDeployment(input: UpdateDeploymentInput): Promise<DeploymentResponse>`

Updates an existing deployment.

**Parameters:**
- `project` (string, required): Name of the deployment to update
- `service` (UpdateServiceInput, required): Service configuration updates
- `tier` (DeploymentTier, optional): New performance tier
- `wait` (boolean, optional): Wait for update to complete

**Example:**
```typescript
const updated = await client.updateDeployment({
  project: 'my-game',
  service: {
    katana: {
      blockTime: 2000, // Update block time
    },
  },
  tier: DeploymentTier.EPIC, // Upgrade tier
  wait: true,
});
```

## Type Safety

All types are auto-generated from the GraphQL schema, ensuring:

1. **Compile-time validation**: TypeScript catches errors before runtime
2. **Schema synchronization**: Types match the API exactly
3. **IntelliSense support**: Full autocomplete in your IDE
4. **No runtime errors**: GraphQL operations are validated at build time

## Verification

The package has been tested and verified to:

- ✅ Generate types successfully from the remote schema
- ✅ Build without TypeScript errors
- ✅ Include proper GraphQL operations for `createDeployment` and `updateDeployment`
- ✅ Pass type checking for all exported functions
- ✅ Work with the graphql-request library

## Next Steps

1. Get your auth token: `slot auth login`
2. Set the token in your code or environment variable
3. Use the client to create and manage deployments
4. Refer to `examples/usage.ts` for more examples

## Updating Schema

If the GraphQL schema changes:

1. Regenerate types: `pnpm generate` (automatically fetches the latest schema from GitHub)
2. Rebuild: `pnpm build`

The type system will automatically catch any breaking changes!
