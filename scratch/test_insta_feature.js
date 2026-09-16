const fs = require('fs');

console.log('=== VERIFYING INSTAGRAM WALL & INTEGRATION ===');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Check Instagram Profile Bar
if (!html.includes('sublimadosmajestic')) throw new Error('Missing handle');
if (!html.includes('https://www.instagram.com/sublimadosmajestic')) throw new Error('Missing Instagram profile link');
if (!html.includes('insta-avatar-wrapper')) throw new Error('Missing avatar ring');
if (!html.includes('insta-verified-badge')) throw new Error('Missing verified badge');

// 2. Check 8 Post Cards
const postCardCount = (html.split('class="insta-post-card"').length - 1);
console.log('Total post cards in carousel:', postCardCount);
if (postCardCount !== 8) throw new Error('Expected 8 post cards, got ' + postCardCount);

// 3. Check Navigation buttons
if (!html.includes('instaScrollPrev') || !html.includes('instaScrollNext')) {
  throw new Error('Missing carousel navigation buttons');
}

// 4. Check CSS rules
if (!html.includes('.insta-wall-container') || !html.includes('.insta-feed-track') || !html.includes('.insta-post-card:hover')) {
  throw new Error('Missing Instagram feed CSS styles');
}

// 5. Check JS logic
if (!html.includes('track.scrollBy({ left: 290, behavior: \'smooth\' })')) {
  throw new Error('Missing carousel navigation script');
}

console.log('=== ALL INSTAGRAM WALL CHECKS PASSED! ===');
