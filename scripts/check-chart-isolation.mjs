import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";

/**
 * Guards the charts boundary.
 *
 * recharts is an optional peer dependency, which is only meaningful if it is
 * genuinely unreachable from the entry points that do not draw charts. Bundlers
 * hide a failure here by tree-shaking it away, so a bundle-size budget alone
 * cannot prove it. A non-bundled runtime cannot: before this split, importing
 * the root barrel in plain Node loaded 246 recharts modules.
 *
 * This walks the emitted module graph from every entry in the exports map and
 * asserts the property directly.
 */

const HEAVY = "recharts";
const IGNORED_ENTRIES = new Set(["./styles.css", "./tokens/*"]);

function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** Bare specifiers reachable from an entry by following relative imports. */
function reachableExternals(entry) {
  const seen = new Set();
  const externals = new Set();

  function walk(file) {
    if (seen.has(file)) {
      return;
    }
    seen.add(file);
    if (!existsSync(file)) {
      return;
    }
    const source = readFileSync(file, "utf8");
    // Covers `import ... from "x"` and `export ... from "x"` alike.
    for (const [, specifier] of source.matchAll(/from\s*"([^"]+)"/g)) {
      if (specifier.startsWith(".")) {
        walk(resolve(dirname(file), specifier));
      } else {
        externals.add(packageName(specifier));
      }
    }
  }

  walk(resolve(entry));
  return externals;
}

if (!existsSync("dist")) {
  process.stderr.write("\nNo dist/ to check. Run `pnpm build` first.\n\n");
  process.exit(1);
}

const { exports: exportMap } = JSON.parse(readFileSync("package.json", "utf8"));
const entries = Object.entries(exportMap).filter(
  ([name]) => !IGNORED_ENTRIES.has(name)
);

const leaked = [];
let chartsCarriesIt = false;

for (const [name, file] of entries) {
  const externals = reachableExternals(file);
  if (name === "./charts") {
    chartsCarriesIt = externals.has(HEAVY);
  } else if (externals.has(HEAVY)) {
    leaked.push(`${name} (${file})`);
  }
}

if (leaked.length > 0) {
  process.stderr.write(
    `\nChart isolation check failed.\n\n${HEAVY} is reachable from ${leaked.length} entry point(s) that should not carry it:\n${leaked.map((name) => `  - ${name}`).join("\n")}\n\nSomething re-exported a chart from a tier barrel. Bundlers will tree-shake it away and hide this, but any non-bundled consumer pays for all of ${HEAVY}.\n\n`
  );
  process.exit(1);
}

if (!chartsCarriesIt) {
  process.stderr.write(
    `\nChart isolation check failed.\n\n./charts does not reach ${HEAVY} at all, which means the entry is empty or broken rather than isolated.\n\n`
  );
  process.exit(1);
}

process.stdout.write(
  `Chart isolation check passed. ${HEAVY} is reachable only from ./charts, across ${entries.length} entry points.\n`
);
