const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require('../controllers/auth.controller');
const { readController, updateController, activateController, orderController, verifyController, successController, refundController, refundSuccessController } = require('../controllers/user.controller');

router.get('/user/:id', requireSignin, readController);
router.get('/user/activate/:token', activateController);
router.put('/user/update', requireSignin, updateController);
router.put('/admin/update', requireSignin, adminMiddleware, updateController);
router.post('/user/order', orderController);
router.post('/user/verify', verifyController);
router.post('/user/success', successController);
router.post('/user/refund', refundController);
router.post('/user/refund/success', refundSuccessController);

module.exports = router;