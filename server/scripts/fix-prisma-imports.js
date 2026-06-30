// scripts/fix-prisma-imports.js
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".js")) {
      const content = readFileSync(full, "utf8");
      const fixed = content.replace(/from "(\.[^"]+)\.ts"/g, 'from "$1.js"');
      if (fixed !== content) writeFileSync(full, fixed);
    }
  }
}

walk("dist/prisma/generated");