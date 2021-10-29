import express from 'express';
import {
    deleteUsers,
    getUserProfile,
    getUsers,
    getUsersById,
    registerUser,
    updataUser,
    updataUserProfile,
    userAuth
} from '../controller/useController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/login').post(userAuth);
router.route('/profile').get(protect, getUserProfile).put(protect, updataUserProfile);
router.route('/:id')
    .delete(protect, admin, deleteUsers)
    .get(protect, admin, getUsersById)
    .put(protect, admin, updataUser)

export default router;


