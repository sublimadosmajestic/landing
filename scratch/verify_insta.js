const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
console.log('Includes insta-wall-container:', html.includes('insta-wall-container'));
console.log('Includes insta-profile-bar:', html.includes('insta-profile-bar'));
console.log('Includes instaFeedTrack:', html.includes('instaFeedTrack'));
console.log('Includes navScript:', html.includes('instaScrollPrev'));
const matches = html.split('class="insta-post-card"');
console.log('Total insta post cards:', matches.length - 1);
