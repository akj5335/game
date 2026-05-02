const express = require('express');
const walletController = require('../controllers/walletController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

// User Routes
router.post('/deposit', walletController.deposit);
router.post('/withdraw', walletController.withdraw);
router.get('/history', walletController.getMyHistory);

// Admin Routes
router.get('/admin/pending', restrictTo('admin'), walletController.getPending);
router.patch('/admin/approve/:id', restrictTo('admin'), walletController.approve);
router.patch('/admin/reject/:id', restrictTo('admin'), walletController.reject);

module.exports = router;
