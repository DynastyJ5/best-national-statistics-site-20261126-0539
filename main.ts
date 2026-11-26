// DataNusa — "Make the best national statistics site" (Node 22, stdlib only).
//
// The site itself is app/: plain static files (index.html, style.css and ES
// modules) that any static server can serve with app/ at its root, and that
// load nothing over the network. This program hands the site in: it copies
// app/ and screenshots/ from beside this file into the output directory and
// writes output/dossier.json with buildDossier from the vendored make.fun
// library. vendor/makefun-frontend.ts is the kit's copy, unchanged — the
// scorer rebuilds the dossier with its own copy and compares byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps (from the kit's gate): the dossier text is capped at
// 160 KiB; at most 4 screenshots, each at most 256 KiB; app/ at most 993
// files and directories and 16 MiB in all. The build refuses rather than
// handing in an entry the scorer would refuse.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);

console.log(`DataNusa handed in: app/ + screenshots/ copied to ${out}, dossier.json written (${dossier.length} bytes).`);
