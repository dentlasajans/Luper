import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    main: 'electron/main.ts',
    preload: 'electron/preload.cts',
    sysInfoWorker: 'electron/native/sysInfoWorker.ts'
  },
  format: ['esm', 'cjs'],
  outDir: 'dist-electron',
  clean: true,
  external: ['electron'],
  platform: 'node',
  target: 'node20',
});
