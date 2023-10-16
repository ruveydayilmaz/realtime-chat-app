const router = require('express').Router();
const controller = require('../../controllers/message.js');

// MIDDLEWARES
const {authenticate} = require('../../middlewares/authenticate');
const {pagination} = require('../../middlewares/pagination');
const {getCacheData} = require('../../middlewares/cache');

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

router.post('/', authenticate, upload.single("file"), controller.sendMessage);

router.get('/:id', authenticate, pagination(), controller.getMessages);

module.exports = router;