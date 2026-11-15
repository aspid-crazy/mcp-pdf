// Kvant wrapper build: puts the server (dist from `npm run build` at the repo root,
// plus its production dependencies) into server/. Native dependencies (@napi-rs/canvas)
// are per platform, so build on each target OS and package with
//   npx @vscode/vsce package --no-dependencies --target <win32-x64 | linux-x64>
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = '..';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

rmSync('server', { recursive: true, force: true });
for (const dir of ['bin', 'dist', 'assets']) cpSync(join(root, dir), join('server', dir), { recursive: true });
for (const file of ['package.json', 'package-lock.json']) copyFileSync(join(root, file), join('server', file));
execFileSync(npm, ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: 'server', stdio: 'inherit', shell: process.platform === 'win32' });
copyFileSync(join(root, 'LICENSE'), 'LICENSE');
