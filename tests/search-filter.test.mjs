import assert from "node:assert/strict";
import test from "node:test";
import { buildSearchOrFilter } from "../src/lib/search-filter.ts";

test("builds a filter across multiple searchable columns", () => {
  assert.equal(
    buildSearchOrFilter(["title", "notes"], "  Docker  "),
    'title.ilike."%Docker%",notes.ilike."%Docker%"',
  );
});

test("keeps PostgREST separators inside a quoted search term", () => {
  assert.equal(
    buildSearchOrFilter(["title"], "DNS,IPv4.(LAN)"),
    'title.ilike."%DNS,IPv4.(LAN)%"',
  );
});

test("escapes quotes, backslashes and LIKE wildcards", () => {
  assert.equal(
    buildSearchOrFilter(["command"], 'a"b\\c%_'),
    'command.ilike."%a\\"b\\\\c\\%\\_%"',
  );
});

test("caps search terms to avoid oversized queries", () => {
  const filter = buildSearchOrFilter(["title"], "a".repeat(200));
  assert.equal(filter, `title.ilike."%${"a".repeat(120)}%"`);
});
