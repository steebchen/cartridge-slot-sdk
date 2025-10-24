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
    authToken: process.env.SLOT_AUTH_TOKEN || '',
    // apiUrl: 'https://api.cartridge.gg/query', // optional - this is the default
  });

	// Create a Katana deployment
	const deployment = await client.createDeployment({
		project: 'my-project',
		team: process.env.SLOT_TEAM || 'my-team',
		tier: DeploymentTier.Basic,
		wait: true,
		service: {
			katana: {
				config: `chain_id = "mykatana"`,
			},
		},
	});

	console.log('Deployment created:', deployment.id);

// Create a Torii deployment
	const toriiDeployment = await client.createDeployment({
		project: 'my-torii-project',
		team: process.env.SLOT_TEAM || 'my-team',
		tier: DeploymentTier.Basic,
		wait: true,
		service: {
			torii: {
				config: `world_address = "0x585a28495ca41bece7640b0ccf2eff199ebe70cc381fa73cb34cc5721614fbd"
rpc = "https://api.cartridge.gg/x/starknet/sepolia"`,
			},
		},
	});

	console.log('Torii Deployment created:', toriiDeployment.id);

	// Update a deployment
	const updated = await client.updateDeployment({
		project: 'my-project',
		tier: DeploymentTier.Pro,
		service: {
			katana: {
				config: `chain_id = "mykatana-updated"`,
			}
		},
	});

	console.log('Deployment updated:', updated.version);

  try {
    // Example 1: Create a Katana deployment
    console.log('Creating Katana deployment...');
    const katanaDeployment = await client.createDeployment({
      project: 'my-katana-project',
      tier: DeploymentTier.Basic,
      service: {
        katana: {
          config: `chain_id = "mykatana"`,
        },
      },
      team: process.env.SLOT_TEAM || 'my-team',
      wait: true, // Wait for deployment to be ready
      regions: ['us-east'], // Optional: specify regions
    });

    console.log('Katana deployment created:');
    console.log('  ID:', katanaDeployment.id);
    console.log('  Version:', katanaDeployment.version);

    // Example 2: Create a Torii deployment
    console.log('\nCreating Torii deployment...');
    const toriiDeployment = await client.createDeployment({
      project: 'my-torii-project',
      tier: DeploymentTier.Basic,
      service: {
        torii: {
          config: `world_address = "0x585a28495ca41bece7640b0ccf2eff199ebe70cc381fa73cb34cc5721614fbd"
rpc = "https://api.cartridge.gg/x/starknet/sepolia"`,
        },
      },
      team: process.env.SLOT_TEAM || 'my-team',
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
          config: `chain_id = "mykatana-updated"`,
        },
      },
      tier: DeploymentTier.Pro, // Upgrade tier
      wait: true,
    });

    console.log('Deployment updated:');
    console.log('  ID:', updatedDeployment.id);
    console.log('  Version:', updatedDeployment.version);
    console.log('  Config:', updatedDeployment.config.configFile);

    // Example 4: Delete the Katana deployment
    console.log('\nDeleting Katana deployment...');
    const katanaDeleted = await client.deleteDeployment('my-katana-project', 'katana');
    console.log('Katana deployment deleted:', katanaDeleted);

    // Example 5: Delete the Torii deployment
    console.log('\nDeleting Torii deployment...');
    const toriiDeleted = await client.deleteDeployment('my-torii-project', 'torii');
    console.log('Torii deployment deleted:', toriiDeleted);

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
