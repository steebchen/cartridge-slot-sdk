import { SlotClient, DeploymentTier } from '../src';

/**
 * Example usage of the Slot TypeScript client
 *
 * Before running:
 * 1. Run `slot auth token` to get your auth token
 * 2. Set your auth token in the client configuration
 */

async function main() {
  // Initialize the client with your auth token
  const client = new SlotClient({
    authToken: process.env.SLOT_AUTH_TOKEN || 'your-auth-token-here',
    // apiUrl: 'https://api.cartridge.gg/query', // optional - this is the default
  });

  try {
    // Example 1: Create a Katana deployment
    console.log('Creating Katana deployment...');
    const katanaDeployment = await client.createDeployment({
      project: 'my-katana-project',
      tier: DeploymentTier.BASIC,
      service: {
        katana: {
          blockTime: 1000, // 1 second block time
          accounts: 10, // Pre-deploy 10 accounts
          disableFee: true, // Disable transaction fees
          seed: 'my-seed', // Optional seed for deterministic accounts
        },
      },
      wait: true, // Wait for deployment to be ready
      regions: ['us-east-1'], // Optional: specify regions
    });

    console.log('Katana deployment created:');
    console.log('  ID:', katanaDeployment.id);
    console.log('  Version:', katanaDeployment.version);
    console.log('  Type:', katanaDeployment.__typename);

    // Example 2: Create a Torii deployment
    console.log('\nCreating Torii deployment...');
    const toriiDeployment = await client.createDeployment({
      project: 'my-torii-project',
      tier: DeploymentTier.HOBBY,
      service: {
        torii: {
          worldAddress: '0x1234567890abcdef1234567890abcdef12345678',
          rpc: 'https://api.cartridge.gg/x/my-katana-project/katana',
          startBlock: 0,
          indexPending: true,
          indexTransactions: true,
          indexRawEvents: false,
        },
      },
      team: 'my-team', // Optional: deploy to a team
      wait: true,
    });

    console.log('Torii deployment created:');
    console.log('  ID:', toriiDeployment.id);
    console.log('  Version:', toriiDeployment.version);

    // Example 3: Update an existing deployment
    console.log('\nUpdating Katana deployment...');
    const updatedDeployment = await client.updateDeployment({
      project: 'my-katana-project',
      service: {
        katana: {
          blockTime: 2000, // Change block time to 2 seconds
          accounts: 20, // Increase accounts
        },
      },
      tier: DeploymentTier.PRO, // Upgrade tier
      wait: true,
    });

    console.log('Deployment updated:');
    console.log('  ID:', updatedDeployment.id);
    console.log('  Version:', updatedDeployment.version);
    console.log('  Config:', updatedDeployment.config.configFile);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the examples
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
