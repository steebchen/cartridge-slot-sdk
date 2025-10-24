const https = require('https');
const fs = require('fs');
const path = require('path');

const SCHEMA_URL = 'https://raw.githubusercontent.com/cartridge-gg/slot/main/slot/schema.json';
const OUTPUT_PATH = path.join(__dirname, '..', 'schema.json');

console.log('Downloading schema from:', SCHEMA_URL);

https.get(SCHEMA_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download schema: HTTP ${response.statusCode}`);
    process.exit(1);
  }

  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    try {
      // Validate that it's valid JSON
      JSON.parse(data);

      fs.writeFileSync(OUTPUT_PATH, data);
      console.log('Schema downloaded successfully to:', OUTPUT_PATH);
    } catch (error) {
      console.error('Failed to parse schema as JSON:', error.message);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('Failed to download schema:', error.message);
  process.exit(1);
});
