/**
 * Amenities and training styles are stored as English labels. Known ones are
 * translated through the "tags" messages; anything an owner typed themselves
 * is shown as written.
 */
type Translator = { (key: string): string; has: (key: string) => boolean };

export const tagKey = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "");

export function tagLabel(t: Translator, tag: string) {
  const key = tagKey(tag);
  return t.has(key) ? t(key) : tag;
}
