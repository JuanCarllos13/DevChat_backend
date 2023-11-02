import { NextFunction, Request, Response } from "express";
import { User } from "../useCases/user.useCases";

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
    const DEFAULT_PAGE_SIZE = 5;
    const DEFAULT_PAGE_NUMBER = 1;

    const number = Number(pageNumber) ?? DEFAULT_PAGE_NUMBER;
    const size = Number(pageSize) ?? DEFAULT_PAGE_SIZE;

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
}

export { UserController };
