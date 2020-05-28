import resolve  from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/bundle.test.js',
      format: 'iife'
    },
    plugins: [
      resolve(),
      commonjs(),
      replace({
        __BUILD_ENV__: 'test',
      }),
    ]
  },
  {
    input: 'src/main.js',
    output: {
      file: 'dist/bundle.release.js',
      format: 'iife'
    },
    plugins: [
      resolve(),
      commonjs(),
      replace({
        __BUILD_ENV__: 'release',
      }),
    ]
  },
];