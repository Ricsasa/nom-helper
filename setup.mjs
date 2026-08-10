#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { cp, readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Installs a backend variant: copies variants/<name>/files over the project
 * root and installs that variant's packages. Run it once, right after cloning.
 *
 *   node setup.mjs supabase
 *   node setup.mjs convex --no-install
 */

const ROOT = dirname(fileURLToPath(import.meta.url));
const VARIANTS_DIR = join(ROOT, 'variants');

async function availableVariants() {
  const entries = await readdir(VARIANTS_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else files.push(path);
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const variant = args.find((arg) => !arg.startsWith('-'));
  const skipInstall = args.includes('--no-install');
  const variants = await availableVariants();

  if (!variant || !variants.includes(variant)) {
    console.error(`Usage: node setup.mjs <${variants.join('|')}> [--no-install]`);
    process.exit(1);
  }

  const source = join(VARIANTS_DIR, variant, 'files');
  await stat(source).catch(() => {
    console.error(`Variant "${variant}" has no files/ directory.`);
    process.exit(1);
  });

  const files = await listFiles(source);
  await cp(source, ROOT, { recursive: true, force: true });
  console.log(`Copied ${files.length} files from variants/${variant}/files:`);
  for (const file of files) console.log(`  ${relative(source, file)}`);

  const deps = JSON.parse(await readFile(join(VARIANTS_DIR, variant, 'deps.json'), 'utf8'));
  const runtime = deps.dependencies ?? [];
  const dev = deps.devDependencies ?? [];

  if (skipInstall) {
    console.log(`\nSkipped install. Packages this variant needs: ${[...runtime, ...dev].join(' ')}`);
  } else {
    for (const [packages, flag] of [
      [runtime, '--save'],
      [dev, '--save-dev'],
    ]) {
      if (packages.length === 0) continue;
      const result = spawnSync('npm', ['install', flag, ...packages], {
        cwd: ROOT,
        stdio: 'inherit',
      });
      if (result.status !== 0) process.exit(result.status ?? 1);
    }
  }

  console.log(`\nNext: read variants/${variant}/README.md, then copy .env.local.example to .env.local.`);
}

await main();
