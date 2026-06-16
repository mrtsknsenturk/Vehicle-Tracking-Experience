#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'artifacts/mascot-app/dist/public');
const dst = path.join(process.cwd(), 'public');

try {
  if (!fs.existsSync(src)) {
    console.error(`ERROR: Source directory not found: ${src}`);
    process.exit(1);
  }

  if (fs.existsSync(dst)) {
    fs.rmSync(dst, { recursive: true });
  }

  fs.cpSync(src, dst, { recursive: true });
  console.log('✓ Build output copied to public');
} catch (err) {
  console.error('Copy failed:', err.message);
  process.exit(1);
}
