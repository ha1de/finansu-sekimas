import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, amount, category, date, description } = req.body;
    
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const transaction = new Transaction({
      user: req.userId,
      type,
      amount,
      category,
      date: date || new Date(),
      description
    });
    
    await transaction.save();
    res.sendResponse(201, transaction);
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.sendResponse(200, transactions);
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};

export const getTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!transaction) {
      res.sendResponse(404, { message: 'Transaction not found' });
      return;
    }
    
    res.sendResponse(200, transaction);
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const { type, amount, category, date, description } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { type, amount, category, date, description },
      { new: true }
    );
    
    if (!transaction) {
      res.sendResponse(404, { message: 'Transaction not found' });
      return;
    }
    
    res.sendResponse(200, transaction);
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!transaction) {
      res.sendResponse(404, { message: 'Transaction not found' });
      return;
    }
    
    res.sendResponse(200, { message: 'Transaction deleted' });
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};