import { NextFunction, Request, Response } from "express";
import { HttpException } from "../interfaces/HttpExceptions";

export function errorMiddleware(
  err: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status: number = err.status ?? 500
  const message: string = err.message ?? "Internal Server Error"

  response.status(status).json({
    message,
    status
  })
}
