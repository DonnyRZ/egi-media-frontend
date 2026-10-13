/* eslint-disable @typescript-eslint/no-require-imports, @next/next/no-assign-module-variable */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');

function load(file, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, Date, Intl, URL,
    require(name) { assert.ok(name in imports, name); return imports[name]; } });
  return module.exports;
}
const layout = load('src/shared/utils/media-row-layout.ts');
const format = load('src/shared/utils/format.ts');
const image = { resolveImageUrl: (src) => src };
const mapper = load('src/shared/mappers/article.mapper.ts', {
  '@/shared/utils/format': format, '@/shared/utils/image': image,
});
const columnMapper = load('src/features/columns/mappers/column.mapper.ts', { '@/shared/utils/image': image });
const { editorialDate } = load('src/shared/utils/editorial-date.ts');

test('dates are deterministic across locales, browser ICU support and day boundaries', () => {
  const date = new Date('2026-10-11T18:00:00Z');
  assert.equal(editorialDate(date, 'id'), '12 Okt');
  assert.equal(editorialDate(date, 'en', { year: true }), 'Oct 12, 2026');
  assert.equal(editorialDate(date, 'uz', { fullMonth: true, time: true }), '12 oktabr, 01:00');
  assert.equal(editorialDate(new Date('invalid'), 'id'), '');
});

test('media candidates leave text space at every compact width and respect user text enlargement', () => {
  for (const width of [296, 336, 351, 366, 388, 406, 456, 576, 616, 743, 744, 796, 888, 999]) {
    for (const scale of [1, 1.25, 1.5, 2]) {
      const gap = 10 * scale;
      const candidates = layout.mediaWidthCandidates(width, gap, scale);
      assert.ok(candidates.length);
      for (const candidate of candidates) {
        assert.ok(candidate > 0 && candidate <= width * .42 + 1);
        assert.ok(width - gap - candidate >= Math.min(160 * scale, width * .55) - 1);
      }
    }
  }
  assert.deepEqual(Array.from(layout.mediaWidthCandidates(0, 10)), []);
});

test('short copy can use larger media; long copy chooses the measured balance without cropping text', () => {
  assert.equal(layout.chooseMediaWidth([{ width: 108, textHeight: 50 }, { width: 140, textHeight: 60 }]), 140);
  assert.equal(layout.chooseMediaWidth([{ width: 108, textHeight: 100 }, { width: 140, textHeight: 160 }]), 108);
  const input = [{ width: 100, textHeight: 110 }, { width: 120, textHeight: 150 }];
  const before = JSON.stringify(input);
  assert.equal(layout.chooseMediaWidth(input), 100);
  assert.equal(JSON.stringify(input), before);
  assert.equal(layout.chooseMediaWidth([]), undefined);
});

test('full headlines stay intact; legacy APIs do not invent duration from a short summary', () => {
  const dto = { id: '1', title: 'Long headline '.repeat(40), slug: 'fixture', summary: 'Brief teaser',
    featured_image: null, published_at: null, category: null, author: { id: '2', full_name: 'Editor' } };
  assert.equal(mapper.mapArticleDto(dto).title, dto.title);
  assert.equal(mapper.mapArticleDto(dto).readingTimeMinutes, null);
  for (const value of [null, 0, -1, NaN, Infinity]) {
    assert.equal(mapper.mapArticleDto({ ...dto, reading_time_minutes: value }).readingTimeMinutes, null);
  }
  assert.equal(mapper.mapArticleDto({ ...dto, reading_time_minutes: 4 }).readingTimeMinutes, 4);
  assert.equal(mapper.mapArticleDetailDto({ ...dto, content: '<p>' + 'word '.repeat(601) + '</p>' }).readingTimeMinutes, 4);
  assert.equal(columnMapper.mapColumnListItemDto({ ...dto, status: 'published', created_at: '2026-10-11' }).readingTimeMinutes, null);
});

test('reading calculation excludes markup, scripts and styles in ID/EN/UZ', () => {
  for (const word of ['kolaborasi', 'cooperation', 'O‘zbekiston']) {
    assert.equal(format.calculateReadingTime(`<style>${'hidden '.repeat(900)}</style><script>${'hidden '.repeat(900)}</script><p>${(word + ' ').repeat(401)}</p>`), 3);
  }
});

test('compact roles have fixed rem fonts, two grid tracks and no clamping/float/fixed copy height', () => {
  const css = fs.readFileSync(path.join(__dirname, '../src/app/horizontal-media.css'), 'utf8');
  assert.match(css, /grid-template-columns: var\(--media-row-width, min\(40%, 9rem\)\) minmax\(0, 1fr\)/);
  assert.match(css, /aspect-ratio: 16 \/ 9/);
  assert.match(css, /font-size: \.8125rem/);
  assert.match(css, /font-size: \.625rem/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.doesNotMatch(css, /line-clamp|float:|text-overflow|zoom:|[;{]\s*height:\s*\d+px/);
});

test('font loading always invalidates measurement even when the computed font name stays the same', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/shared/hooks/useBalancedMediaRow.ts'), 'utf8');
  assert.match(source, /fontRevision \+= 1; schedule\(\)/);
  assert.match(source, /fonts\.ready\.then\(scheduleFonts\)/);
  assert.match(source, /scale, fontRevision, style\.font/);
});
