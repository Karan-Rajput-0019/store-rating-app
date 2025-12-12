const express = require('express');

const authRouter = require('./auth.routes');
const adminRouter = require('./admin.routes');
const storeRouter = require('./store.routes');
const ownerRouter = require('./owner.routes');
const userRouter = require('./user.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/stores', storeRouter);
router.use('/owners', ownerRouter);
router.use('/users', userRouter);

module.exports = router;

