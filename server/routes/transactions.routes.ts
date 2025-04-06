import express from 'express';
import { body } from 'express-validator';
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactions.controller';
import validateRequest from '../middlewares/validateRequest';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().toDate().withMessage('Valid date is required')
  ],
  validateRequest,
  createTransaction
);

router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;