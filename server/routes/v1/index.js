// PACKAGES
const express = require('express');
const router = express.Router();

// ROUTES
const authRoutes = require('./auth');
const chatRoutes = require('./chat');
const messageRoutes = require('./message');
const userRoutes = require('./user');

// MIDDLEWARES
const {authenticate} = require('../../middlewares/authenticate.js')

router.use('/auth', authRoutes);
router.use('/chat', authenticate, chatRoutes);
router.use('/message', messageRoutes);
router.use('/user', userRoutes);

module.exports = router;