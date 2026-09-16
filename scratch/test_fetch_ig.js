const https = require('https');

function fetchWithUA(ua) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.instagram.com',
      path: '/sublimadosmajestic/',
      method: 'GET',
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function run() {
  console.log('Testing Googlebot UA...');
  const res1 = await fetchWithUA('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
  console.log('Status 1:', res1.status, 'Length:', res1.body ? res1.body.length : 0);
  if (res1.body) {
    const imgs = res1.body.match(/https:\/\/[^"'\s]+\.cdninstagram\.com\/[^"'\s]+/g) || [];
    console.log('CDN images found:', imgs.length);
    if (imgs.length > 0) console.log('Sample:', imgs.slice(0, 3));
  }

  console.log('Testing Facebookbot UA...');
  const res2 = await fetchWithUA('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');
  console.log('Status 2:', res2.status, 'Length:', res2.body ? res2.body.length : 0);
  if (res2.body) {
    const ogImg = res2.body.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogImg) console.log('OG Image:', ogImg[1]);
    const imgs = res2.body.match(/https:\/\/[^"'\s]+\.cdninstagram\.com\/[^"'\s]+/g) || [];
    console.log('CDN images found (FB):', imgs.length);
  }
}

run();
