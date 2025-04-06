import express from 'express';
import { getUser, updateUser } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware'; // This is correct now

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUser);
router.put('/', updateUser);

export default router;