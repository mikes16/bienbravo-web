import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    'src/lib/api/generated/': {
      preset: 'client',
      config: {
        useFragmentMasking: false,
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
