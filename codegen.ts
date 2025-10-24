import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.json',
  documents: ['src/**/*.ts'],
  generates: {
    './src/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false
      }
    },
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request'
      ],
      config: {
        rawRequest: true,
        skipTypename: false,
        avoidOptionals: false
      }
    }
  },
  ignoreNoDocuments: true
};

export default config;
