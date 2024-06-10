// @ts-check
import html from 'eslint-plugin-html'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import node from 'eslint-plugin-node'
import reactHooks from 'eslint-plugin-react-hooks'
import jest from 'eslint-plugin-jest'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['**/dist', '**/dev', '**/temp', '**/coverage']
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'prettier',
      'plugin:jest/recommended'
    )
  ),

  {
    plugins: {
      html,
      prettier,
      react: fixupPluginRules(react),
      node,
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      jest: fixupPluginRules(jest)
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        chrome: true,
        browser: true
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      react: {
        version: 'detect'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'warn'
    }
  },

  {
    rules: {
      semi: 'off',
      maxWarnings: 'off',
      'no-console': 'warn',
      'react/prop-types': 'off',
      'block-scoped-var': 'error',
      'consistent-return': 'off',

      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': [
        'warn',
        { tags: [], roles: ['tabpanel'], allowExpressionValues: true }
      ],

      'import/prefer-default-export': 'off',

      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['**/.*rc.js', '**/.*rc.cjs', '**/*.config.js', '**/*.config.cjs'],

    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  }
]
