import type { NextFunction, Request, Response } from "express";

/**
 * Wraps an async Express handler so thrown/rejected errors are forwarded to
 * the global error handler in app.ts instead of crashing the process or
 * requiring a try/catch in every controller function.
 */
export function asyncHandler<T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: T, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}