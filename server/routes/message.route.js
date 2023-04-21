import express from 'express';
import { addMessage, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

router.post('/', upload.single("file"), addMessage);

router.get('/:chatId', getMessages);

export default router