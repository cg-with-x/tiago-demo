import resolve  from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default [
  {
    input: 'src/1v1/main.js',
    output: {
      file: 'dist/1v1.test.js',
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
    input: 'src/1v1/main.js',
    output: {
      file: 'dist/1v1.release.js',
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
  {
    input: 'src/multi-player/main.js',
    output: {
      file: 'dist/multi-player.test.js',
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
    input: 'src/multi-player/main.js',
    output: {
      file: 'dist/multi-player.release.js',
      format: 'iife'
    },
    plugins: [
      resolve(),
      commonjs(),
      replace({
        __BUILD_ENV__: 'release',
      }),
    ]
  }
];