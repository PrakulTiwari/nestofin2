const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require('../controllers/auth.controller');
const { readController, updateController, isAuth, orderController, verifyController, successController, withdrawController, addbeneficiaryController, getbeneficiary } = require('../controllers/user.controller');

router.get('/user/:id', requireSignin, readController);
router.put('/user/update', requireSignin, updateController);
router.put('/admin/update', requireSignin, adminMiddleware, updateController);
router.post('/user/order', orderController);
router.post('/user/verify', verifyController);
router.post('/user/success', successController);
router.post('/user/withdraw', isAuth, withdrawController);
router.post('/user/addbeneficiary', isAuth, addbeneficiaryController);
router.get('/user/getbeneficiary/:id', isAuth, getbeneficiary);

module.exports = router;