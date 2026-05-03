const express = require('express');
const rewardController = require('../controllers/rewardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/daily', rewardController.claimDailyReward);
router.post('/ad-watch', rewardController.watchAdReward);

module.exports = router;
