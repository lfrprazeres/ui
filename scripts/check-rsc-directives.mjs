import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

/**
 * Guards the React Server Components boundary.
 *
 * Bundlers routinely hoist or strip "use client" directives, and when that
 * happens nothing throws. The package installs, types resolve, and the
 * component simply stops working inside an App Router server tree. This
 * compares the directives in source against the ones that survived the build
 * and fails the release if any went missing.
 */

const TIERS = ["charts", "components", "elements"];
const DIRECTIVE = "use client";

function modulesWithDirective(dir, extension) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(extension) && !file.includes(".stories."))
    .filter((file) => readFileSync(join(dir, file), "utf8").includes(DIRECTIVE))
    .map((file) => `${dir.split("/").pop()}/${file.replace(extension, "")}`);
}

const expected = TIERS.flatMap((tier) =>
  modulesWithDirective(`src/${tier}`, ".tsx")
);
const actual = TIERS.flatMap((tier) =>
  modulesWithDirective(`dist/${tier}`, ".js")
);
const missing = expected.filter((name) => !actual.includes(name));

if (missing.length > 0) {
  process.stderr.write(
    `\nRSC boundary check failed.\n\n${missing.length} module(s) declare "${DIRECTIVE}" in source but lost it in the build:\n${missing.map((name) => `  - ${name}`).join("\n")}\n\nThis breaks React Server Components silently. Check that the build still runs unbundled.\n\n`
  );
  process.exit(1);
}

process.stdout.write(
  `RSC boundary check passed. ${actual.length} of ${expected.length} client modules kept their directive.\n`
);
