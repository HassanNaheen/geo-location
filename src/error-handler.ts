import { AxiosError } from 'axios';
import { Request, Response, NextFunction } from 'express';

export const errorHandeler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AxiosError)
    return res.status(400).send({ err: [{ message: err.response?.data }] });

  return res
    .status(400)
    .send({ err: [{ message: err.message ?? 'Something went wrong' }] });
};
