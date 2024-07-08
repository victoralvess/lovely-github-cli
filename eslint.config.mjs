// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'max-len': ['error', { code: 80, tabWidth: 2 }],
      'indent': 'off',
      '@typescript-eslint/indent': ['error', 2],
      'semi': 'off',
      '@typescript-eslint/semi': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);