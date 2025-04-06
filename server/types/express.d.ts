import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    
    interface Response {
      sendResponse: (status: number, data?: any) => Response;
    }
  }
}