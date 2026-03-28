/**
 * @arkite/ui/eslint-config
 *
 * 共享 ESLint Flat Config — 所有 Ark 前端專案統一使用。
 * 依據: arkite-frontend/FRONTEND-ARCHITECTURE-REVIEW.md §5.5, §5.13, §5.14
 *
 * 用法:
 *   // eslint.config.js
 *   import { createEslintConfig } from '@arkite/ui/eslint-config'
 *   export default createEslintConfig()
 *
 * 自訂 (保留專案特有規則):
 *   export default createEslintConfig({
 *     files: ['src/**\/*.{ts,tsx}'],
 *     extraRules: { 'no-console': 'off' },
 *     ignores: ['dist/', 'storybook-static/'],
 *   })
 */

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

/**
 * @param {object} [options]
 * @param {string[]} [options.files] - 檔案 glob pattern (預設 src/**\/*.{ts,tsx})
 * @param {string[]} [options.ignores] - 忽略的路徑
 * @param {Record<string, unknown>} [options.extraRules] - 額外或覆寫規則
 * @param {string[]} [options.controlComponents] - jsx-a11y 自訂 control 元件名稱
 */
export function createEslintConfig(options = {}) {
  const {
    files = ['src/**/*.{ts,tsx}'],
    ignores = ['**/dist/', '**/node_modules/', '**/*.config.*', '**/vite-env.d.ts'],
    extraRules = {},
    controlComponents = [],
  } = options

  // 合併預設 + 自訂的 control 元件
  const allControls = [
    'Input', 'Select', 'Textarea', 'PasswordInput', 'SearchInput',
    'TagInput', 'Combobox', 'FilterSelect', 'Switch', 'Checkbox', 'RadioGroup',
    ...controlComponents,
  ]

  return tseslint.config(
    { ignores },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files,
      plugins: {
        'react-hooks': reactHooks,
        'jsx-a11y': jsxA11y,
      },
      languageOptions: {
        globals: { ...globals.browser },
      },
      rules: {
        // ── Type Safety ──
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        }],

        // ── React ──
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // ── Code Quality ──
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'error',
        'no-var': 'error',

        // ── Accessibility ──
        ...jsxA11y.configs.recommended.rules,
        'jsx-a11y/label-has-associated-control': ['warn', {
          controlComponents: allControls,
          assert: 'either',
          depth: 3,
        }],
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'jsx-a11y/no-autofocus': 'warn',

        // ── 專案覆寫 ──
        ...extraRules,
      },
    },
  )
}

export default createEslintConfig
