#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const PAGE_PATH = path.join(ROOT, 'worldwide.html');
const FALLBACK_PATH = path.join(ROOT, 'data', 'worldwide-fallback.json');

const SEARCH_QUERIES = [
  { platform: 'youtube', query: 'mandela effect recent video', summary: 'Recent public video discussion about a shared memory glitch.' },
  { platform: 'youtube', query: 'mandela effect 2025 video', summary: 'Fresh YouTube coverage of the Mandela Effect phenomenon.' },
  { platform: 'blog', query: 'mandela effect blog 2025', summary: 'Recent article or blog post documenting a widely reported memory mismatch.' },
  { platform: 'blog', query: 'mandela effect article 2024', summary: 'A newer written take on the Mandela Effect and altered cultural memory.' },
  { platform: 'tiktok', query: 'mandela effect tiktok', summary: 'Recent short-form video discussing memory inconsistencies and repeat errors.' },
  { platform: 'facebook', query: 'mandela effect facebook post', summary: 'A recent public post or discussion from Facebook about shared misremembering.' },
];

function readFallback() {
  if (!fs.existsSync(FALLBACK_PATH)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(FALLBACK_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const transport = url.startsWith('https:') ? https : http;
    const request = transport.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (response) => {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk.toString();
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode || 0,
            body,
          });
        });
      }
    );

    request.on('error', reject);
  });
}

function stripTags(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeUrl(rawUrl) {
  const trimmed = decodeHtmlEntities((rawUrl || '').trim());
  if (!trimmed) {
    return '';
  }

  try {
    const asUrl = new URL(trimmed);
    if (asUrl.searchParams.get('uddg')) {
      return decodeURIComponent(asUrl.searchParams.get('uddg'));
    }
    return asUrl.href;
  } catch (error) {
    return trimmed;
  }
}

function hostFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./i, '');
  } catch (error) {
    return 'web';
  }
}

function getYouTubeVideoId(url) {
  if (!url) {
    return '';
  }

  const match = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : '';
}

function getThumbnailUrl(item) {
  if (item.thumbnail) {
    return item.thumbnail;
  }

  const videoId = getYouTubeVideoId(item.url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  if (item.platform === 'tiktok') {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
  }

  if (item.platform === 'facebook') {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
  }

  if (item.platform === 'blog') {
    return 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80';
  }

  return 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80';
}

function parseDuckDuckGoResults(html) {
  const resultLinks = [...html.matchAll(/<a rel="nofollow" class="result-link" href="(.*?)">(.*?)<\/a>/gi)];
  const items = [];

  for (const match of resultLinks) {
    const href = normalizeUrl(match[1]);
    const title = decodeHtmlEntities(stripTags(match[2] || '')).trim();

    if (!href || !title || href.includes('duckduckgo.com')) {
      continue;
    }

    items.push({
      title,
      url: href,
      host: hostFromUrl(href),
    });
  }

  return items;
}

async function fetchSearchResults(query) {
  const fullUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await httpGet(fullUrl);

  if (response.statusCode >= 400) {
    throw new Error(`Search request failed with status ${response.statusCode}`);
  }

  return parseDuckDuckGoResults(response.body || '');
}

function buildPlatformLabel(platform) {
  const labels = {
    youtube: 'YOUTUBE',
    blog: 'BLOG',
    tiktok: 'TIKTOK',
    facebook: 'FACEBOOK',
  };
  return labels[platform] || 'WEB';
}

function buildPlatformTitle(platform) {
  const labels = {
    youtube: 'YouTube',
    blog: 'Blog',
    tiktok: 'TikTok',
    facebook: 'Facebook',
  };
  return labels[platform] || 'Web';
}

function buildMediaMarkup(item) {
  const videoId = getYouTubeVideoId(item.url);
  const safeHost = (item.host || 'web').toString().toUpperCase();
  const thumbnailUrl = getThumbnailUrl(item);

  if (videoId) {
    return `
      <div class="video-window">
        <iframe src="https://www.youtube.com/embed/${videoId}?rel=0" title="${escapeHtml(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    `;
  }

  if (thumbnailUrl) {
    return `
      <img class="entry-thumb" src="${escapeHtml(thumbnailUrl)}" alt="${escapeHtml(item.title)}" />
    `;
  }

  if (item.platform === 'tiktok' || item.platform === 'facebook' || item.platform === 'youtube') {
    return `
      <div class="video-window">
        <div class="video-poster">
          [ ${buildPlatformTitle(item.platform).toUpperCase()} · ${escapeHtml(item.title)} ]
        </div>
      </div>
    `;
  }

  return `
    <div class="video-window">
      <div class="video-poster">
        [ ${escapeHtml(safeHost)} · ${escapeHtml(item.title)} ]
      </div>
    </div>
  `;
}

function buildEntryMarkup(item) {
  const platformTitle = buildPlatformTitle(item.platform);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const mediaMarkup = buildMediaMarkup(item);

  return `
    <article class="entry">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="meta">${dateStamp} <span class="tag">${buildPlatformLabel(item.platform)}</span></div>
      <p>${escapeHtml(item.summary || 'Recent public reference from the your memory archive across social and web platforms.')}</p>
      ${mediaMarkup}
      <div class="external-actions">
        <a class="external-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open in ${platformTitle}</a>
      </div>
    </article>
  `;
}

function uniqueEntries(entries) {
  const seen = new Set();
  const merged = [];

  for (const item of entries) {
    const key = `${item.platform}:${item.url}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
}

async function collectRecentEntries() {
  const discovered = [];

  for (const source of SEARCH_QUERIES) {
    try {
      const results = await fetchSearchResults(source.query);
      const items = results.slice(0, 2).map((result) => ({
        ...result,
        platform: source.platform,
        summary: source.summary,
      }));

      discovered.push(...items);
    } catch (error) {
      console.warn(`Search failed for "${source.query}": ${error.message}`);
    }
  }

  const fallback = readFallback().map((item) => ({
    ...item,
    host: item.host || 'web',
    platform: item.platform || 'blog',
    summary: item.summary || 'Recent public reference from the web.',
  }));

  const merged = uniqueEntries([
    ...discovered,
    ...fallback.map((item) => ({
      ...item,
      platform: item.platform || 'blog',
      summary: item.summary || 'Recent public reference from the web.'
    })),
  ]);

  return merged.slice(0, 8);
}

function injectEntriesIntoPage(feedHtml) {
  const source = fs.readFileSync(PAGE_PATH, 'utf8');
  const marker = '<!-- AUTO_WORLDWIDE_FEED -->';

  if (!source.includes(marker)) {
    throw new Error('The worldwide page is missing the AUTO_WORLDWIDE_FEED marker.');
  }

  const updated = source.replace(marker, feedHtml);
  fs.writeFileSync(PAGE_PATH, updated, 'utf8');
}

async function main() {
  const entries = await collectRecentEntries();
  const feedHtml = entries.map(buildEntryMarkup).join('\n');
  injectEntriesIntoPage(feedHtml);
  console.log(`Worldwide feed updated with ${entries.length} entries.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to update worldwide feed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  buildEntryMarkup,
  getYouTubeVideoId,
  normalizeUrl,
  collectRecentEntries,
};
