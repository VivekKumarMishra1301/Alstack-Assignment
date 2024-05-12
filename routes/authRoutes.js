import express from 'express';
import { activity, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js'
import { activityMonitoring } from '../middlewares/checkInactivity.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh-token', protect, refreshAccessToken);

router.get('/checkinactivity',protect,activityMonitoring, activity);
export default router;