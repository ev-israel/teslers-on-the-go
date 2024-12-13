import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginTestingLibrary from 'eslint-plugin-testing-library';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    eslintPluginPrettierRecommended,
    eslintPluginTestingLibrary.configs['flat/react'],
    eslintPluginReact.configs.flat.recommended,
  ],
  plugins: {
    'react-hooks': eslintPluginReactHooks,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    ...eslintPluginReactHooks.configs.recommended.rules,
  },
});
