// ══════════════════════════════════════════════════════════════
// SAMBHA CREATION — Prisma Configuration (v7)
// Required for Prisma 7+ which moved connection URLs here
// ══════════════════════════════════════════════════════════════

import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from 'prisma/config';

// Load .env.local or .env manually (Prisma v7 doesn't auto-load these)
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        // Remove surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
      break; // Only load the first found
    }
  }
}

loadEnv();

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  // Database URL for Prisma CLI commands (db push, migrate, seed)
  datasource: {
    url: process.env.DATABASE_URL!,
  },

  // Seed command
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },

});
