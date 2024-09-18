/* eslint-disable no-localhost-url/no-localhost-url */
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Custom rule to flag "http://localhost:5000" with a warning
const noLocalhostUrl = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow http://localhost:5000',
    },
    schema: [], // no options for this rule
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes('http://localhost:5000')) {
          context.report({
            node,
            message: '"http://localhost:5000" should not be used in Prod.',
            severity: 1,  // 1 means "warning"
          });
        }
      }
    };
  }
}

const noLocalhostUrlPlugin = {
  rules: {
    'no-localhost-url': noLocalhostUrl,
  },
};

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'no-localhost-url': noLocalhostUrlPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "no-console": "warn",
      'no-localhost-url/no-localhost-url': 'warn', // Apply the rule
    },
  },
]
