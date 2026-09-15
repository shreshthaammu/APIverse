import { Response } from 'express';

export function success(res: Response, data: unknown, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function failure(res: Response, message: string, code: string, status: number): void {
  res.status(status).json({ success: false, error: { message, code } });
}