const fs = require('fs');
const path = 'C:/Users/Auxiliar/.gemini/antigravity-ide/brain/d8d76cae-14d7-439b-926e-130f49e44cb5/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(path)) {
  console.log('No transcript found at:', path);
  process.exit(1);
}
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n').filter(Boolean);
const userSteps = [];
for (const line of lines) {
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT') {
      userSteps.push({ step: data.step_index, content: data.content });
    }
  } catch (e) {}
}
console.log('Total user steps:', userSteps.length);
userSteps.slice(-10).forEach(u => {
  console.log(`\n=== STEP ${u.step} ===\n${u.content}`);
});
