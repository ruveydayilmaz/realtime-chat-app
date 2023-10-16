const router = require('express').Router();
const controller = require('../../controllers/chat.js');

router.post('/', controller.createChat);
router.get('/', controller.getUserChats);
router.get('/find/:firstId/:secondId', controller.findChat);

module.exports = router;