#!/usr/bin/env node
// Copies the API's emitted schema into this repo's committed copy.
// Run before `npm run codegen` whenever the API schema changes.
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const src = resolve(process.cwd(), '..', 'bienbravo-api', 'src', 'graphql', 'schema.generated.graphql')
const dst = resolve(process.cwd(), 'schema.graphql')

if (!existsSync(src)) {
  console.error(`sync-schema: source not found at ${src}`)
  console.error('Is ../bienbravo-api checked out as a sibling?')
  process.exit(1)
}

copyFileSync(src, dst)
console.log(`sync-schema: ${src} → ${dst}`)
