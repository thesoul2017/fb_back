const Router = require('express');
const router = new Router();
const budgetController = require('../controllers/budgetController');

router.post('/', budgetController.create);
router.delete('/delete/:id', budgetController.delete);
router.post('/get', budgetController.getByUserId);
router.put('/update', budgetController.update);
router.post('/group-by-type', budgetController.getGroupByType);
router.post('/group-by-date', budgetController.getGroupByDate);
router.post('/group-by-category', budgetController.getGroupByCategory);

module.exports = router;
