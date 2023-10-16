const router = require('express').Router();
const controller= require('../../controllers/user.js');

router.get('/:id', controller.getUser);
router.get('/', controller.getAllUsers)
router.delete('/:id', controller.deleteUser)

module.exports = router;