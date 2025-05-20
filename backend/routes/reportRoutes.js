import express from 'express';
const router = express.Router();

import { getReport } from '../controller/reportsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


router.route('/').get(protect, admin, getReport);

export default router;
