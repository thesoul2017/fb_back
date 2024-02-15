const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const budgetRouter = require('./budgetRouter');
const groupRouter = require('./groupRouter');
const categoryRouter = require('./categoryRouter');

router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/budget', budgetRouter);
router.use('/group', groupRouter);

module.exports = router;
