import express from 'express'
import { deleteUser, followUser, getAllUsers, getUser, unfollowUser, updateUser } from '../controllers/user.controller.js'
import authMiddleWare from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/',getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)
router.put('/:id/unfollow',authMiddleWare, unfollowUser)

export default router