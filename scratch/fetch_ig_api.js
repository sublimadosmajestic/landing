const https = require('https');
const fs = require('fs');

function fetchIG() {
  return new Promise((resolve) => {
    // Use Instagram's JSON API endpoint
    const options = {
      hostname: 'www.instagram.com',
      path: '/api/v1/users/web_profile_info/?username=sublimadosmajestic',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 9; GM1903) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.89 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'es-CO,es;q=0.9',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function run() {
  console.log('Fetching Instagram API...');
  const res = await fetchIG();
  console.log('Status:', res.status);
  
  if (res.error) {
    console.error('Error:', res.error);
    return;
  }

  if (res.status === 200) {
    try {
      const data = JSON.parse(res.body);
      const user = data.data?.user;
      if (user) {
        console.log('Username:', user.username);
        console.log('Full Name:', user.full_name);
        console.log('Followers:', user.edge_followed_by?.count);
        console.log('Posts:', user.edge_owner_to_timeline_media?.count);
        console.log('Profile Pic:', user.profile_pic_url_hd || user.profile_pic_url);
        
        const posts = user.edge_owner_to_timeline_media?.edges || [];
        console.log('\nPosts found:', posts.length);
        posts.slice(0, 12).forEach((post, i) => {
          const p = post.node;
          const imgUrl = p.thumbnail_src || p.display_url || p.thumbnail_resources?.[2]?.src;
          const isVideo = p.is_video;
          const shortcode = p.shortcode;
          const likes = p.edge_liked_by?.count || p.edge_media_preview_like?.count || 0;
          const comments = p.edge_media_to_comment?.count || 0;
          const caption = p.edge_media_to_caption?.edges?.[0]?.node?.text?.substring(0, 80) || '';
          console.log(`[${i}] ${isVideo ? '📹' : '📷'} ${shortcode} | ❤️${likes} 💬${comments}`);
          console.log(`     IMG: ${imgUrl ? imgUrl.substring(0, 100) : 'N/A'}`);
          console.log(`     CAP: ${caption}`);
        });
        
        // Save full JSON for reference
        fs.writeFileSync('scratch/ig_data.json', JSON.stringify(data, null, 2).substring(0, 100000), 'utf8');
        console.log('\nSaved ig_data.json');
      } else {
        console.log('No user data found');
        console.log('Body:', res.body.substring(0, 500));
      }
    } catch (e) {
      console.log('JSON parse error:', e.message);
      console.log('Body sample:', res.body.substring(0, 300));
    }
  } else {
    console.log('Non-200 status. Body:', res.body.substring(0, 400));
  }
}

run().catch(console.error);
