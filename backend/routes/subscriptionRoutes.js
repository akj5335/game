const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

router.use(protect);

router.post('/create-order', subscriptionController.createOrder);
router.post('/verify', subscriptionController.verifyPayment);
router.post('/manual-request', subscriptionController.requestManualSubscription);

module.exports = router;
