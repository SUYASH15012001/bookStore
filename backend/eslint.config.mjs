import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()

export default [
  ...compat.extends('standard'),
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    ignores: ['node_modules/', 'dist/', 'build/']
  }
]
