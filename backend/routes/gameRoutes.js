const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGame);

module.exports = router;
