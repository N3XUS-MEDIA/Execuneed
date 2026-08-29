import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/**
 * Shared flat config. Packages extend this and add their own env rules.
 * Compliance-critical lanes (server, domain, ai) get stricter treatment in
 * apps/web/eslint.config.mjs.
 */
export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/generated/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
)
