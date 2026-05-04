const supabase = require('./config/supabase');
const fs = require('fs');

async function updateGames() {
  const reportPath = './game_status_report.json';
  if (!fs.existsSync(reportPath)) {
    console.error('Report file not found. Run checkGames.js first.');
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const notWorkingTitles = report.notWorking.map(g => g.title);

  console.log(`Setting is_working to false for ${notWorkingTitles.length} games...`);

  // First, let's assume the column is_working exists and default is true.
  // We just need to set is_working = false for the ones in the notWorking array.
  
  // Update in chunks to avoid overwhelming the API
  const chunkSize = 10;
  for (let i = 0; i < notWorkingTitles.length; i += chunkSize) {
    const chunk = notWorkingTitles.slice(i, i + chunkSize);
    
    const { data, error } = await supabase
      .from('games')
      .update({ is_working: false })
      .in('title', chunk);
      
    if (error) {
      console.error('Error updating chunk:', error);
    } else {
      console.log(`Updated ${i + chunk.length} / ${notWorkingTitles.length}`);
    }
  }

  // Set working games explicitly to true just in case
  const { error: resetError } = await supabase
    .from('games')
    .update({ is_working: true })
    .not('title', 'in', `(${notWorkingTitles.map(t => `"${t}"`).join(',')})`); // approximate, but we know default is true anyway.

  console.log('Finished updating games.');
}

updateGames();
