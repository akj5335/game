const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('../models/Game');

dotenv.config({ path: './.env' });

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Delete existing games
    await Game.deleteMany();
    console.log('Existing games cleared.');

    const categories = ['Action', 'Puzzle', 'Racing', 'Sports', 'Arcade', 'Strategy'];
    const games = [];

    for (let i = 1; i <= 150; i++) {
      games.push({
        title: `Awesome Game ${i}`,
        // Using a generic thumbnail placeholder for demonstration
        thumbnail: `https://picsum.photos/seed/${i}/300/200`,
        // Using a safe HTML5 game iframe for demonstration (e.g. from GameDistribution or CrazyGames)
        iframeUrl: 'https://html5.gamedistribution.com/rvvASMiM/5b0ae00778c148f3acddff05cd997087/',
        category: categories[Math.floor(Math.random() * categories.length)],
        popularity: Math.floor(Math.random() * 10000),
        isActive: true,
      });
    }

    await Game.insertMany(games);
    console.log('✅ 150 games seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
};

seedGames();
