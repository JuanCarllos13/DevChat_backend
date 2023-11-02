import { NextFunction, Request, Response } from "express";
import { HttpException } from "../interfaces/HttpExceptions";
import { verify } from "jsonwebtoken";

interface IPayload {
  name: string;
  email: string;
  user_id: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new HttpException(401, "Token missing");
  }

  try {
    const [, token] = authorization.split(" ");

    if (!process.env.TOKEN_SECRET) {
      throw new HttpException(401, "TOKEN_SECRET not found");
    }

    const { name, user_id, email } = verify(
      token,
      process.env.TOKEN_SECRET
    ) as IPayload;

    req.user_id = user_id;
    req.name = name;
    req.email = email;

    next();
  } catch (error) {
    console.log("error", error);
    throw new HttpException(401, "Token expired");
  }
}
