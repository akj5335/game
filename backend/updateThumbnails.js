const supabase = require('./config/supabase');

const premiumThumbnails = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1538481199732-466a04fff7b5?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b7738?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1493711662285-5853473c8a70?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fd10d614?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1580238053412-19c771746f0d?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1548685913-fe6678babe8d?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=800&fit=crop'
];

async function updateThumbnails() {
  console.log('Fetching working games...');
  const { data: games, error } = await supabase
    .from('games')
    .select('id, title')
    .eq('is_working', true);

  if (error) {
    console.error('Failed to fetch games:', error);
    process.exit(1);
  }

  console.log(`Found ${games.length} working games. Updating thumbnails...`);

  let count = 0;
  for (const game of games) {
    // Assign a random thumbnail from our premium list based on the game's ID or title length to keep it consistent
    const hash = game.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const thumbIndex = hash % premiumThumbnails.length;
    const newThumbnail = premiumThumbnails[thumbIndex];

    const { error: updateError } = await supabase
      .from('games')
      .update({ thumbnail: newThumbnail })
      .eq('id', game.id);

    if (updateError) {
      console.error(`Error updating ${game.title}:`, updateError);
    } else {
      count++;
    }
  }

  console.log(`Successfully updated ${count} thumbnails with premium imagery!`);
}

updateThumbnails();
