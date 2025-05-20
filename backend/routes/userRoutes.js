import express from 'express';

const router = express.Router();

import {   
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile, 
  getUsers,
  deleteUser,
  getUserById,
  updateUser, } from '../controller/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/').post(registerUser).get(protect, admin, getUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);



export default router;   
 