const https = require('https');

async function get(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
        'Accept': 'text/html,*/*',
        'Accept-Language': 'es-CO'
      }
    };
    https.get(opts, (res) => {
      let d = '';
      // Follow redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Redirect to:', res.headers.location.substring(0, 80));
        return resolve(get(res.headers.location.startsWith('http') ? res.headers.location : url + res.headers.location));
      }
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    }).on('error', e => resolve({ error: e.message }));
  });
}

(async () => {
  const urls = [
    'https://imginn.com/sublimadosmajestic/',
    'https://instanavigation.com/sublimadosmajestic/',
    'https://storiesig.info/sublimadosmajestic',
    'https://gramvio.com/sublimadosmajestic/',
  ];

  for (const url of urls) {
    console.log('\n===', url.substring(8,35), '===');
    const r = await get(url);
    if (r.error) { console.log('Error:', r.error); continue; }
    console.log('Status:', r.status);
    if (r.status === 200 && r.body.length > 100) {
      // Look for post shortcodes
      const shorts = [...new Set((r.body.match(/\/p\/([A-Za-z0-9_-]{10,15})\//g) || []))];
      // Look for CDN image URLs
      const cdnImgs = [...new Set((r.body.match(/https:\/\/[^\s"'<>]+(?:scontent|cdninstagram|instagram)[^\s"'<>]*\.jpg[^\s"'<>]*/gi) || []))];
      console.log('Shortcodes found:', shorts.length, '-', shorts.slice(0,4).join(' | '));
      console.log('CDN images found:', cdnImgs.length, '-', cdnImgs[0] ? cdnImgs[0].substring(0, 80) : 'none');
    }
  }
})();
