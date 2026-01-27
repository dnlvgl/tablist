export default {
  build: { overwriteDest: true },
  run: {
    startUrl: ['about:debugging'], // Open URLs on start
  },
  ignoreFiles: [
    'docs/**',
    'screenshots/**',
    'test/**',
    '.git',
    'node_modules',
    'biome.json',
    'package.json',
    'package-lock.json',
    'web-ext-config.cjs',
  ],
};
