const test = require('node:test');
const assert = require('node:assert/strict');

const { buildEntryMarkup, getYouTubeVideoId } = require('./update-worldwide.js');

test('extracts YouTube video IDs from watch URLs', () => {
  assert.equal(
    getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    'dQw4w9WgXcQ'
  );
});

test('buildEntryMarkup creates an embeddable YouTube card with an external link', () => {
  const html = buildEntryMarkup({
    title: 'Recent Mandela Effect video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    summary: 'A new public discussion about a shared memory mismatch.',
    host: 'www.youtube.com',
  });

  assert.match(html, /youtube\.com\/embed\/dQw4w9WgXcQ/);
  assert.match(html, /Open in YouTube/);
  assert.match(html, /Recent Mandela Effect video/);
});

test('buildEntryMarkup prefers real thumbnails over generic placeholder text', () => {
  const html = buildEntryMarkup({
    title: 'Why so many people remember a different Fruit of the Loom logo',
    url: 'https://www.tiktok.com/tag/mandelaeffect',
    platform: 'tiktok',
    summary: 'Short-form debate about whether the remembered logo is a cultural memory or a revised corporate identity.',
    host: 'www.tiktok.com',
    thumbnail: 'https://example.com/thumb.jpg',
  });

  assert.match(html, /<img class="entry-thumb"/);
  assert.doesNotMatch(html, /\[ TIKTOK ·/);
});

test('buildEntryMarkup includes platform routing for TikTok and Facebook', () => {
  const tiktokHtml = buildEntryMarkup({
    title: 'TikTok Mandela Effect watch',
    url: 'https://www.tiktok.com/@example/video/123',
    platform: 'tiktok',
    summary: 'Short-form clip discussing a collective memory glitch.',
    host: 'www.tiktok.com',
  });

  const facebookHtml = buildEntryMarkup({
    title: 'Facebook Memory Error',
    url: 'https://www.facebook.com/groups/example/posts/123',
    platform: 'facebook',
    summary: 'People comparing notes on a shared false memory.',
    host: 'www.facebook.com',
  });

  assert.match(tiktokHtml, /Open in TikTok/);
  assert.match(facebookHtml, /Open in Facebook/);
});
