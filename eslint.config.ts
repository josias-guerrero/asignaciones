import js from '@eslint/js'
import globals from 'globals'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    // 1. Quitamos ts, mts y cts de los archivos a evaluar
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  // 2. Eliminamos por completo la línea de tseslint.configs.recommended
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
])
