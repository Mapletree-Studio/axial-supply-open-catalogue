#!/usr/bin/env node
/**
 * Refresh this dataset from the live site and record what changed.
 *
 *   node update.mjs          fetch, diff, write files and CHANGELOG entry
 *
 * The site is the source; nothing here is edited by hand. Commit the result.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ORIGIN = "https://axialsupply.co.uk";
const today = new Date().toISOString().slice(0, 10);
const res = await fetch(`${ORIGIN}/api/v1/catalogue.json`);
if (!res.ok) throw new Error(`catalogue.json returned ${res.status}`);
const live = await res.json();
const csv = await (await fetch(`${ORIGIN}/catalogue.csv`)).text();

const lines = [...live.lines].sort((a, b) => a.sku.localeCompare(b.sku));
const prev = existsSync("catalogue.json") ? JSON.parse(readFileSync("catalogue.json", "utf8")).lines : [];
const before = new Map(prev.map((l) => [l.sku, l]));
const after = new Map(lines.map((l) => [l.sku, l]));

const added = lines.filter((l) => !before.has(l.sku)).map((l) => l.sku);
const removed = prev.filter((l) => !after.has(l.sku)).map((l) => l.sku);
const repriced = lines
  .filter((l) => before.has(l.sku) && before.get(l.sku).priceIncVat !== l.priceIncVat)
  .map((l) => `${l.sku}: ${before.get(l.sku).priceIncVat ?? "on request"} → ${l.priceIncVat ?? "on request"}`);

writeFileSync("catalogue.json", JSON.stringify({ supplier: live.supplier, lines }, null, 1) + "\n");
writeFileSync("catalogue.csv", csv);

const codes = new Map();
for (const l of lines) {
  const c = codes.get(l.unspsc) ?? { unspsc: l.unspsc, title: l.unspscTitle, cpv: l.cpv, lines: 0 };
  c.lines++;
  codes.set(l.unspsc, c);
}
writeFileSync("classification.json", JSON.stringify([...codes.values()].sort((a, b) => a.unspsc.localeCompare(b.unspsc)), null, 1) + "\n");

if (prev.length === 0 || added.length || removed.length || repriced.length) {
  const entry = [
    `## ${today}`,
    "",
    prev.length === 0 ? `First release: ${lines.length} lines.` : `${lines.length} lines.`,
    added.length && prev.length ? `- Added (${added.length}): ${added.join(", ")}` : "",
    removed.length ? `- Removed (${removed.length}): ${removed.join(", ")}` : "",
    repriced.length ? `- Price changes (${repriced.length}):\n${repriced.map((r) => `  - ${r}`).join("\n")}` : "",
    "",
  ].filter((x) => x !== "").join("\n");
  const old = existsSync("CHANGELOG.md") ? readFileSync("CHANGELOG.md", "utf8").replace(/^# Changelog\n\n/, "") : "";
  writeFileSync("CHANGELOG.md", `# Changelog\n\n${entry}\n\n${old}`.trimEnd() + "\n");
}
console.log(`${lines.length} lines; +${added.length} -${removed.length} repriced ${repriced.length}`);
