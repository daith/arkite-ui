import { createEslintConfig } from './src/configs/eslint.js'

export default createEslintConfig({
  ignores: ['dist/', 'storybook-static/', 'node_modules/', '*.config.*'],
})
