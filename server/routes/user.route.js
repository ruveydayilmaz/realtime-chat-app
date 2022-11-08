import express from 'express'
import { deleteUser, getAllUsers, getUser } from '../controllers/user.controller.js'
import authMiddleWare from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/',getAllUsers)
router.delete('/:id',authMiddleWare, deleteUser)

export default router