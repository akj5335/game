const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Supabase URL or Service Role Key missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const gameList = [
  // Action / Arcade
  { title: "Subway Surfers", category: "Action" },
  { title: "Temple Run 2", category: "Action" },
  { title: "Stickman Hook", category: "Action" },
  { title: "Jetpack Joyride", category: "Action" },
  { title: "Fruit Ninja", category: "Action" },
  { title: "Helix Jump", category: "Action" },
  { title: "Stack Ball", category: "Action" },
  { title: "Run 3", category: "Action" },
  { title: "Fireboy and Watergirl", category: "Action" },
  { title: "Vex 3", category: "Action" },
  { title: "Vex 4", category: "Action" },
  { title: "Vex 5", category: "Action" },
  { title: "Vex 6", category: "Action" },
  { title: "Geometry Dash", category: "Action" },
  { title: "Bullet Force", category: "Action" },
  { title: "Zombs Royale", category: "Action" },
  { title: "Tank Trouble", category: "Action" },
  { title: "Stick Fight", category: "Action" },
  { title: "Super Smash Flash", category: "Action" },
  { title: "Bad Ice Cream", category: "Action" },

  // Racing
  { title: "Drift Hunters", category: "Racing" },
  { title: "Madalin Stunt Cars 2", category: "Racing" },
  { title: "Moto X3M", category: "Racing" },
  { title: "Moto X3M Winter", category: "Racing" },
  { title: "Moto X3M Pool Party", category: "Racing" },
  { title: "Burnin’ Rubber 5", category: "Racing" },
  { title: "Car Simulator Arena", category: "Racing" },
  { title: "Traffic Rider", category: "Racing" },
  { title: "Highway Racer", category: "Racing" },
  { title: "Speed Racing Pro", category: "Racing" },
  { title: "City Car Driving", category: "Racing" },
  { title: "Real Drift Car", category: "Racing" },
  { title: "Offroad Jeep Simulator", category: "Racing" },
  { title: "Extreme Car Driving", category: "Racing" },
  { title: "Formula Racer", category: "Racing" },
  { title: "Super Bike Racer", category: "Racing" },
  { title: "Parking Fury", category: "Racing" },
  { title: "Parking Fury 2", category: "Racing" },
  { title: "Parking Fury 3", category: "Racing" },
  { title: "Racing Thunder", category: "Racing" },

  // Puzzle
  { title: "2048", category: "Puzzle" },
  { title: "Cut the Rope", category: "Puzzle" },
  { title: "Candy Crush Saga", category: "Puzzle" },
  { title: "Bubble Shooter", category: "Puzzle" },
  { title: "Sudoku", category: "Puzzle" },
  { title: "Mahjong", category: "Puzzle" },
  { title: "Word Search", category: "Puzzle" },
  { title: "Tetris", category: "Puzzle" },
  { title: "Unblock Me", category: "Puzzle" },
  { title: "Brain Test", category: "Puzzle" },
  { title: "Flow Free", category: "Puzzle" },
  { title: "Lines 98", category: "Puzzle" },
  { title: "Merge Numbers", category: "Puzzle" },
  { title: "Pipe Puzzle", category: "Puzzle" },
  { title: "Color Match", category: "Puzzle" },
  { title: "Block Puzzle", category: "Puzzle" },
  { title: "Tile Master", category: "Puzzle" },
  { title: "Jigsaw Puzzle", category: "Puzzle" },
  { title: "Connect 4", category: "Puzzle" },
  { title: "Crossword Puzzle", category: "Puzzle" },

  // Multiplayer / IO
  { title: "Agar.io", category: "Multiplayer" },
  { title: "Slither.io", category: "Multiplayer" },
  { title: "Paper.io", category: "Multiplayer" },
  { title: "Paper.io 2", category: "Multiplayer" },
  { title: "Diep.io", category: "Multiplayer" },
  { title: "Krunker.io", category: "Multiplayer" },
  { title: "Shell Shockers", category: "Multiplayer" },
  { title: "Surviv.io", category: "Multiplayer" },
  { title: "Hole.io", category: "Multiplayer" },
  { title: "Worms Zone", category: "Multiplayer" },
  { title: "Little Big Snake", category: "Multiplayer" },
  { title: "Skribbl.io", category: "Multiplayer" },
  { title: "Gartic.io", category: "Multiplayer" },
  { title: "Zombs.io", category: "Multiplayer" },
  { title: "Ev.io", category: "Multiplayer" },
  { title: "Smash Karts", category: "Multiplayer" },
  { title: "Snowball.io", category: "Multiplayer" },
  { title: "FlyOrDie.io", category: "Multiplayer" },
  { title: "Starblast.io", category: "Multiplayer" },
  { title: "Splix.io", category: "Multiplayer" },

  // Endless / Casual
  { title: "Flappy Bird", category: "Arcade" },
  { title: "Crossy Road", category: "Arcade" },
  { title: "Doodle Jump", category: "Arcade" },
  { title: "Paper Toss", category: "Arcade" },
  { title: "Knife Hit", category: "Arcade" },
  { title: "Bottle Flip", category: "Arcade" },
  { title: "Tower Stack", category: "Arcade" },
  { title: "Color Switch", category: "Arcade" },
  { title: "Jump Ball", category: "Arcade" },
  { title: "Rolling Sky", category: "Arcade" },
  { title: "Ball Blast", category: "Arcade" },
  { title: "ZigZag", category: "Arcade" },
  { title: "Stack Tower", category: "Arcade" },
  { title: "Bounce Ball", category: "Arcade" },
  { title: "Run Sausage Run", category: "Arcade" },
  { title: "Sky Rolling Ball", category: "Arcade" },
  { title: "Perfect Hit", category: "Arcade" },
  { title: "Tap Tap Dash", category: "Arcade" },
  { title: "Endless Runner", category: "Arcade" },
  { title: "Crazy Jump", category: "Arcade" },

  // Sports
  { title: "FIFA Online", category: "Sports" },
  { title: "Head Soccer", category: "Sports" },
  { title: "Basketball Stars", category: "Sports" },
  { title: "Basketball Legends", category: "Sports" },
  { title: "Soccer Skills", category: "Sports" },
  { title: "Penalty Shooters", category: "Sports" },
  { title: "8 Ball Pool", category: "Sports" },
  { title: "9 Ball Pool", category: "Sports" },
  { title: "Mini Golf", category: "Sports" },
  { title: "Tennis Clash", category: "Sports" },
  { title: "Cricket World Cup", category: "Sports" },
  { title: "Stickman Soccer", category: "Sports" },
  { title: "Street Basketball", category: "Sports" },
  { title: "Golf Battle", category: "Sports" },
  { title: "Hockey Stars", category: "Sports" },
  { title: "Table Tennis", category: "Sports" },
  { title: "Baseball Pro", category: "Sports" },
  { title: "Bowling King", category: "Sports" },
  { title: "Boxing Random", category: "Sports" },
  { title: "Wrestling Jump", category: "Sports" },

  // Adventure / Strategy
  { title: "Clash of Tanks", category: "Strategy" },
  { title: "Kingdom Rush", category: "Strategy" },
  { title: "Stick War", category: "Strategy" },
  { title: "Age of War", category: "Strategy" },
  { title: "Grow Castle", category: "Strategy" },
  { title: "Tower Defense", category: "Strategy" },
  { title: "Plants vs Zombies", category: "Strategy" },
  { title: "Bloons Tower Defense", category: "Strategy" },
  { title: "Viking Village", category: "Strategy" },
  { title: "Empire Builder", category: "Strategy" },
  { title: "Idle Miner", category: "Strategy" },
  { title: "Adventure Quest", category: "Strategy" },
  { title: "Hero Simulator", category: "Strategy" },
  { title: "Dungeon Quest", category: "Strategy" },
  { title: "Monster Merge", category: "Strategy" },
  { title: "Island Survival", category: "Strategy" },
  { title: "Survival Craft", category: "Strategy" },
  { title: "Zombie Defense", category: "Strategy" },
  { title: "War Simulator", category: "Strategy" },
  { title: "Battle Arena", category: "Strategy" },

  // Fun / Misc
  { title: "Among Us", category: "Arcade" },
  { title: "Google Snake", category: "Arcade" },
  { title: "Dino Runner", category: "Arcade" },
  { title: "Pacman", category: "Arcade" },
  { title: "Space Invaders", category: "Arcade" },
  { title: "Minesweeper", category: "Puzzle" },
  { title: "Solitaire", category: "Puzzle" },
  { title: "Chess", category: "Strategy" },
  { title: "Checkers", category: "Strategy" },
  { title: "Tic Tac Toe", category: "Puzzle" }
];

const seedGames = async () => {
  try {
    console.log('Clearing existing games...');
    const { error: deleteError } = await supabase
      .from('games')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) throw deleteError;

    const seededGames = gameList.map((g) => {
      const slug = g.title.toLowerCase()
        .replace(/’/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
        
      return {
        title: g.title,
        category: g.category,
        thumbnail: `https://images.crazygames.com/${slug}/thumb-150.png`,
        iframe_url: `https://www.crazygames.com/embed/${slug}`,
        popularity: Math.floor(Math.random() * 100000) + 10000,
        is_active: true
      };
    });

    console.log(`Inserting ${seededGames.length} games...`);
    
    // Split into chunks of 50 to avoid payload limits
    for (let i = 0; i < seededGames.length; i += 50) {
      const chunk = seededGames.slice(i, i + 50);
      const { error } = await supabase.from('games').insert(chunk);
      if (error) throw error;
      console.log(`Inserted chunk ${i / 50 + 1}`);
    }

    console.log(`✅ Successfully seeded ${seededGames.length} games in Supabase!`);
    
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

seedGames();
