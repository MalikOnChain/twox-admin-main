'use strict'

/**
 * Runs `husky install` only on local dev machines.
 * Skips on Vercel/CI so `npm install` does not fail during `prepare`.
 */
const { execSync } = require('node:child_process')
const path = require('node:path')

const skip =
  process.env.HUSKY === '0' ||
  process.env.CI === 'true' ||
  process.env.CI === '1' ||
  process.env.VERCEL === '1' ||
  process.env.CONTINUOUS_INTEGRATION === 'true'

if (skip) {
  process.exit(0)
}

const root = path.join(__dirname, '..')

try {
  execSync('husky install', { stdio: 'inherit', cwd: root })
} catch {
  process.exit(0)
}
