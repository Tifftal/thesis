import eslintPluginTS from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'], // Поддержка файлов TypeScript и JavaScript
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      import: eslintPluginImport,
      '@typescript-eslint': eslintPluginTS,
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      // Настройки TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Общие настройки
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      'comma-spacing': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'func-names': ['error', 'as-needed'],
      semi: ['error', 'always'],
      'semi-spacing': ['error', { before: false, after: true }],
      'no-else-return': 'error',
      'no-prototype-builtins': 'error',
      'no-bitwise': 'error',
      'guard-for-in': 'error',
      'no-mixed-operators': 'error',
      'prefer-arrow-callback': 'error',
      'array-callback-return': 'error',
      'no-use-before-define': 'error',
      'one-var-declaration-per-line': 'error',
      'no-loop-func': 'error',
      'no-restricted-globals': ['error', 'event', 'fdescribe'],
      'no-confusing-arrow': 'error',
      'react/no-deprecated': 'warn',
      'no-nested-ternary': 'error',
      'space-before-blocks': ['error', { functions: 'always', keywords: 'always', classes: 'always' }],
      'max-classes-per-file': ['error', 1],
      'class-methods-use-this': 'error',
      'nonblock-statement-body-position': ['error', 'beside'],
      'brace-style': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-multi-spaces': 'error',
      'block-spacing': 'error',
      'key-spacing': 'error',
      'padded-blocks': ['error', 'never'],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxBOF: 0,
          maxEOF: 1,
        },
      ],
      'lines-between-class-members': ['error', 'always'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': ['error'],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'no-lonely-if': 'error',
      'no-console': 'error',
      // не импортируем библиотеку целиком, только нужные функции/модули
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lodash',
              importNames: ['_'],
            },
          ],
        },
      ],
      // количество условий в функции не должно быть больше 15 (ухудшает производительность и читаемость кода)
      complexity: ['warn', 30],
      // обязательный default в конструкциях switch case
      'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
      // безопасная проверка на null
      'no-eq-null': 'warn',
      // не используем return await в функциях с async
      'no-return-await': 'warn',
      // не присваиваем значения в переменную, уже равную этому значению
      'no-self-assign': 'error',
      // на случай сравнений вида x === x
      'no-self-compare': 'error',
      // убираем ненужные склеивания строк
      'no-useless-concat': 'error',
      // убираем лишний return
      'no-useless-return': 'error',
      // async функции должны содержать await
      'require-await': 'warn',
      // убираем неиспользуемые переменные (Под вопросом, надо понять, как объекдинить с TS, включать при МР)
      // "no-unused-vars": "error",
      // убираем дублирования в аргументах
      'no-dupe-args': 'error',
      // не оставляем пустые блоки кода и лишние скобки вокруг блоков кода
      'no-empty': 'error',
      'no-lone-blocks': 'error',
      // недостижимый код
      'no-unreachable': 'error',
      // убираем неиспользуемые импорты
      'unused-imports/no-unused-imports': 'warn', // Предупреждение для неиспользуемых импортов
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Порядок импортов
      'import/order': [
        'error',
        {
          groups: [
            ['builtin'],
            'external', // Импорты библиотек
            'internal', // сервисы, ui-kit
            'parent', // компоненты
            'type', // типы
            'sibling', // константы, helpers, хуки
            'index', // стили, графика
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '{**}',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'services/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'ui-kit/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '**/types',
              group: 'type',
              position: 'before',
            },
            {
              pattern: './types',
              group: 'type',
              position: 'after',
            },
            {
              pattern: '../types',
              group: 'type',
              position: 'after',
            },
            {
              pattern: './constants',
              group: 'sibling',
              position: 'before',
            },
            {
              pattern: '**/constants',
              group: 'sibling',
              position: 'before',
            },
            {
              pattern: '**/helpers',
              group: 'sibling',
              position: 'after',
            },
            {
              pattern: '**/hooks/**',
              group: 'sibling',
              position: 'after',
            },
            {
              pattern: 'components/**',
              group: 'parent',
              position: 'before',
            },
            {
              pattern: 'pages/**',
              group: 'parent',
              position: 'after',
            },
            {
              pattern: 'common/**',
              group: 'parent',
              position: 'after',
            },
            {
              pattern: 'assets/**',
              group: 'sibling',
              position: 'before',
            },
            {
              pattern: '**/*.css',
              group: 'sibling',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          distinctGroup: true,
          named: false,
          warnOnUnassignedImports: false,
        },
      ],
    },
  },
];
