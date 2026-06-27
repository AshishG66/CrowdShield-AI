import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CrowdShield Backend Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};
