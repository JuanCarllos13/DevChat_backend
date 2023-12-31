import { NextFunction, Request, Response } from "express";
import { User } from "../useCases/user.useCases";
import { HttpException } from "../interfaces/HttpExceptions";

class UserController {
  private usersUserCase: User;
  constructor() {
    this.usersUserCase = new User();
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;
    try {
      const result = await this.usersUserCase.createUser({
        name,
        email,
        password,
      });
      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    try {
      const result = await this.usersUserCase.auth({
        email,
        password,
      });

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(request: Request, response: Response, next: NextFunction) {
    const { pageSize, pageNumber } = request.query;
    const DEFAULT_PAGE_SIZE = 2;
    const DEFAULT_PAGE_NUMBER = 1;

    const number = pageNumber ? Number(pageNumber) : DEFAULT_PAGE_NUMBER;
    const size = pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE;

    console.log("size", size);
    console.log("number", number);

    try {
      const result = await this.usersUserCase.findAllUsers({
        pageSize: size,
        pageNumber: number,
      });

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async upload(request: Request, response: Response, next: NextFunction) {
    const file = request.file;
    const { user_id } = request;
    try {
      if (!file?.filename) {
        throw new HttpException(400, "File doesn't exist");
      }

      const result = await this.usersUserCase.upload(file?.filename, user_id);

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
