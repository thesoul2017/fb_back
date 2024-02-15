const Router = require('express');
const groupController = require("../controllers/groupController");
const router = new Router();

router.post('/', groupController.create);
router.post('/add-user', groupController.addUser);
router.delete('/remove-user/:id', groupController.removeUser);
router.post('/find-group-by-Code', groupController.findGroupByCode);
router.post('/find-group-by-User', groupController.findGroupByUser);
router.post('/find-users-in-group', groupController.fundUsersInGroup);

module.exports = router;
