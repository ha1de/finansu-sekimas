import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.sendResponse(404, { message: 'User not found' });
      return;
    }
    
    res.sendResponse(200, user);
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.sendResponse(401, { message: 'Not authenticated' });
      return;
    }
    
    const { name } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name },
      { new: true }
    ).select('-password');
    
    if (!user) {
      res.sendResponse(404, { message: 'User not found' });
      return;
    }
    
    res.sendResponse(200, user);
  } catch (error) {
    console.error(error);
    res.sendResponse(500, { message: 'Server error' });
  }
};