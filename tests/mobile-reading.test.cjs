const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '../src/app/public-mobile.css'), 'utf8');

test('compact typography uses one rem scale, without narrower-phone overrides', () => {
  const expected = {
    'page-title': 1.5, 'article-title': 1.5, 'lead-title': 1.375,
    'card-title': 1.125, 'list-title': 1, 'section-title': 1.0625,
    body: .9375, summary: .875, 'reader-meta': .75, 'card-meta': .75,
  };
  for (const [role, size] of Object.entries(expected)) {
    const declarations = [...css.matchAll(new RegExp(`--mobile-${role}:\\s*([\\d.]+)rem`, 'g'))];
    assert.equal(declarations.length, 1, `${role} must have a single standard size`);
    assert.equal(Number(declarations[0][1]), size);
  }
});

test('compact breakpoint excludes 1024px desktop and extends to short landscape', () => {
  assert.match(css, /@media \(width < 1024px\), \(width < 1200px\) and \(height <= 500px\)/);
  assert.doesNotMatch(css, /1023\.999|1199\.999/);
  assert.match(css, /\.egi-public \.editorial-inset-free \{ padding-inline: 0; \}/);
  assert.match(css, /--reading-gutter: max\(\.75rem, env\(safe-area-inset-left, 0px\), env\(safe-area-inset-right, 0px\)\)/);
});

test('public mobile controls keep touch targets and paragraphs retain natural height', () => {
  assert.match(css, /min-width: 44px; min-height: 44px/);
  assert.match(css, /\.egi-public \.editorial-dialog-actions \{ flex-wrap: wrap; \}/);
  assert.match(css, /\.egi-public \.editorial-reader > \* \+ \* \{ margin-top: \.75rem; \}/);
  assert.match(css, /\.egi-public \.article-legacy > \* \{ margin-block-end: 0; \}/);
  assert.doesNotMatch(css, /zoom\s*:|transform\s*:\s*scale/);
});
