const https = require('https');

// Try multiple approaches to get real Instagram post data
async function tryFetch(hostname, path, headers) {
  return new Promise((resolve) => {
    const opts = { hostname, path, headers };
    https.get(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    }).on('error', e => resolve({ error: e.message }));
  });
}

(async () => {
  // Try 1: Instagram GraphQL with proper headers
  console.log('--- Test 1: Instagram GraphQL ---');
  const r1 = await tryFetch('www.instagram.com',
    '/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"54244073654","first":12}',
    {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      'Accept': 'application/json',
      'X-IG-App-ID': '936619743392459',
    }
  );
  console.log('Status:', r1.status || r1.error);
  if (r1.body) {
    try {
      const j = JSON.parse(r1.body);
      const edges = j.data?.user?.edge_owner_to_timeline_media?.edges || [];
      console.log('Posts found:', edges.length);
      edges.slice(0,3).forEach((e,i) => {
        console.log(`[${i}]`, e.node.shortcode, '|', (e.node.thumbnail_src||'').substring(0,80));
      });
    } catch(_) { console.log('Not JSON:', r1.body.substring(0, 100)); }
  }

  // Try 2: Ddinstagram (a known Instagram proxy service)
  console.log('\n--- Test 2: ddinstagram.com ---');
  const r2 = await tryFetch('www.ddinstagram.com',
    '/sublimadosmajestic/',
    { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', 'Accept': 'text/html' }
  );
  console.log('Status:', r2.status || r2.error);
  if (r2.body) {
    // Look for post shortcodes
    const shorts = [...new Set((r2.body.match(/\/p\/([A-Za-z0-9_-]{10,15})\//g) || []))];
    console.log('Shortcodes:', shorts.slice(0,5).join(', '));
  }

  // Try 3: imginn.org (alternative domain)
  console.log('\n--- Test 3: imginn.org ---');
  const r3 = await tryFetch('imginn.org',
    '/sublimadosmajestic/',
    { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0) Safari/605.1.15', 'Accept': 'text/html' }
  );
  console.log('Status:', r3.status || r3.error);
  if (r3.body && r3.status === 200) {
    const shorts = [...new Set((r3.body.match(/\/p\/([A-Za-z0-9_-]{10,15})\//g) || []))];
    const cdnImgs = (r3.body.match(/https:\/\/[^"']+\.(jpg|webp|jpeg)[^"']*/gi) || []).slice(0,3);
    console.log('Shortcodes:', shorts.slice(0,5).join(', '));
    console.log('Images:', cdnImgs.slice(0,2));
  }

})();
