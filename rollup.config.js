import { createBabelInputPluginFactory } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import html from 'rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import svg from 'rollup-plugin-svg'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import babelConfig from './babel.config.json'

const babelPluginForUMDBundle = createBabelInputPluginFactory()
const babelPluginForESMBundle = createBabelInputPluginFactory()
const babelPluginOptions = { ...babelConfig, exclude: 'node_modules/**', babelHelpers: 'bundled' }

const plugins = [
  html(),
  postcss({ inject: false }),
  svg(),
  size(),
  filesize(),
  !!process.env.DEV && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  !!process.env.ANALYZE_BUNDLE && visualize({ open: true }),
]

const mainBundle = {
  input: 'src/skeleton.js',
  external: ['@clappr/core'],
  output: [
    {
      name: 'SkeletonPlugin',
      file: pkg.main,
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
    },
    !!process.env.MINIMIZE && {
      name: 'SkeletonPlugin',
      file: 'dist/clappr-skeleton-plugin.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      plugins: terser(),
    },
  ],
  plugins: [babelPluginForUMDBundle(babelPluginOptions), resolve(), commonjs(), ...plugins],
}

const esmBundle = {
  input: 'src/skeleton.js',
  external: ['@clappr/core', /@babel\/runtime/],
  output: {
    name: 'SkeletonPlugin',
    file: pkg.module,
    format: 'esm',
    globals: { '@clappr/core': 'Clappr' },
  },
  plugins: [
    babelPluginForESMBundle({
      ...babelPluginOptions,
      plugins: [
        [
          '@babel/plugin-transform-runtime', {
            useESModules: true,
            absoluteRuntime: true,
            version: pkg.devDependencies['@babel/plugin-runtime'],
          },
        ],
      ],
      babelHelpers: 'runtime',
    }),
    ...plugins,
  ],
}

export default [mainBundle, esmBundle]
