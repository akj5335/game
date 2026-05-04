const supabase = require('./config/supabase');
const axios = require('axios');
const fs = require('fs');

async function checkGames() {
  console.log('Fetching games from database...');
  const { data: games, error } = await supabase.from('games').select('*');
  
  if (error) {
    console.error('Error fetching games:', error);
    process.exit(1);
  }

  console.log(`Found ${games.length} games. Testing URLs...`);
  
  const working = [];
  const notWorking = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    process.stdout.write(`Checking ${i+1}/${games.length}: ${game.title}... `);
    
    try {
      // Use a timeout and a generic user agent to avoid blocking
      const response = await axios.get(game.iframe_url, { 
        timeout: 8000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const xFrameOptions = response.headers['x-frame-options'];
      const csp = response.headers['content-security-policy'];
      
      let canBeFramed = true;
      let reason = '';
      
      if (xFrameOptions && (xFrameOptions.toUpperCase() === 'DENY' || xFrameOptions.toUpperCase() === 'SAMEORIGIN')) {
        canBeFramed = false;
        reason = `X-Frame-Options: ${xFrameOptions}`;
      } else if (csp && csp.includes('frame-ancestors') && !csp.includes('*')) {
        canBeFramed = false;
        reason = `CSP frame-ancestors restricts embedding`;
      }
      
      if (canBeFramed) {
        console.log('✅ WORKING');
        working.push(game);
      } else {
        console.log(`❌ BLOCKED (${reason})`);
        notWorking.push({ ...game, reason });
      }
      
    } catch (err) {
      const reason = err.response ? `HTTP ${err.response.status}` : err.message;
      console.log(`❌ FAILED (${reason})`);
      notWorking.push({ ...game, reason });
    }
  }

  console.log('\n--- SUMMARY ---');
  console.log(`Working: ${working.length}`);
  console.log(`Not Working: ${notWorking.length}`);

  const reportPath = './game_status_report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    workingCount: working.length,
    notWorkingCount: notWorking.length,
    notWorking: notWorking.map(g => ({ title: g.title, url: g.iframe_url, reason: g.reason }))
  }, null, 2));
  
  console.log(`\nReport saved to ${reportPath}`);
  process.exit(0);
}

checkGames();
