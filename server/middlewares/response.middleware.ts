import { Request, Response, NextFunction } from 'express';

const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.sendResponse = function(status: number, data?: any) {
    return this.status(status).json(data);
  };
  next();
};

export default responseMiddleware;