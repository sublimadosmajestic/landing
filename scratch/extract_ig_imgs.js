const https = require('https');
const fs = require('fs');

function fetchIG(ua) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.instagram.com',
      path: '/sublimadosmajestic/',
      method: 'GET',
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-CO,es;q=0.9',
        'Cookie': ''
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.status || res.statusCode, body: data }));
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function run() {
  const res = await fetchIG('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');
  
  // Look for actual CDN post images (scontent.cdninstagram.com)
  const postImgs = [...new Set(
    (res.body.match(/https:\/\/scontent[^"'\s\)]+\.cdninstagram\.com[^"'\s\)]+\.jpg[^"'\s\)]*/g) || [])
      .map(u => u.replace(/&amp;/g, '&'))
  )];
  
  console.log('Post CDN images found:', postImgs.length);
  postImgs.forEach((u, i) => console.log(`[${i}]`, u.substring(0, 120)));

  // Also look for og:image and other meta images
  const ogImgs = (res.body.match(/<meta property="og:image" content="([^"]+)"/g) || [])
    .map(m => m.match(/content="([^"]+)"/)[1].replace(/&amp;/g, '&'));
  console.log('\nOG Images:', ogImgs.length);
  ogImgs.forEach((u, i) => console.log(`[og:${i}]`, u.substring(0, 120)));

  // Save body for analysis
  fs.writeFileSync('scratch/ig_body.html', res.body.substring(0, 50000), 'utf8');
  console.log('\nSaved first 50k chars to scratch/ig_body.html');
}

run().catch(console.error);
