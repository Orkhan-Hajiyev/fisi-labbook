/**
 * Build a PostgREST OR filter without letting search text change its grammar.
 * Quoted filter values protect commas, dots and parentheses; backslashes and
 * double quotes are escaped for the quoted PostgREST value. LIKE wildcards
 * from user input are escaped so they are searched literally.
 */
export function buildSearchOrFilter(fields: readonly string[], search: string): string {
  const escaped = search.trim().slice(0, 120).replace(/[\\"%_]/g, (character) => `\\${character}`);
  return fields.map((field) => `${field}.ilike."%${escaped}%"`).join(",");
}
