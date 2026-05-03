const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes after this middleware are protected and restricted to admin
router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getStats);
router.patch('/users/:id/balance', adminController.updateUserBalance);

module.exports = router;
