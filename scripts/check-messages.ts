/**
 * Checks every messages/<locale>.json against English: same keys, valid ICU
 * syntax, and no arguments or tags that English doesn't pass.
 *   bun run i18n:check
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { IntlMessageFormat } from "intl-messageformat";

type Messages = { [key: string]: string | Messages };
type Element = { type: number; value: string; options?: Record<string, { value: Element[] }>; children?: Element[] };

const dir = join(import.meta.dir, "..", "messages");
const load = (locale: string): Messages => JSON.parse(readFileSync(join(dir, `${locale}.json`), "utf8"));

function flatten(messages: Messages, prefix = "", out = new Map<string, string>()) {
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === "string") out.set(prefix + key, value);
    else flatten(value, `${prefix}${key}.`, out);
  }
  return out;
}

function names(elements: Element[], out = new Set<string>()) {
  for (const el of elements) {
    // literal (0) and pound (7) carry no names
    if (el.type !== 0 && el.type !== 7) out.add(el.type === 8 ? `<${el.value}>` : el.value);
    for (const option of Object.values(el.options ?? {})) names(option.value, out);
    if (el.children) names(el.children, out);
  }
  return out;
}

function parse(message: string, locale: string) {
  return names(new IntlMessageFormat(message, locale).getAst() as unknown as Element[]);
}

const english = flatten(load("en"));
const englishNames = new Map([...english].map(([key, message]) => [key, parse(message, "en")]));
let problems = 0;
const report = (locale: string, key: string, issue: string) => {
  problems++;
  console.log(`${locale}  ${key}: ${issue}`);
};

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const locale = file.replace(/\.json$/, "");
  const messages = flatten(load(locale));
  for (const key of english.keys()) if (!messages.has(key)) report(locale, key, "missing");
  for (const [key, message] of messages) {
    const expected = englishNames.get(key);
    if (!expected) {
      report(locale, key, "not in English");
      continue;
    }
    try {
      for (const name of parse(message, locale)) if (!expected.has(name)) report(locale, key, `unknown ${name}`);
    } catch (error) {
      report(locale, key, (error as Error).message);
    }
  }
}

console.log(problems ? `\n${problems} problem(s)` : `✓ ${english.size} messages checked in every locale`);
process.exit(problems ? 1 : 0);
