import { NextFunction, Request, Response } from "express";
import { Rooms } from "../useCases/rooms.useCases";

class RoomsController {
  private RoomsUserCase: Rooms;
  constructor() {
    this.RoomsUserCase = new Rooms();
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;
    const { user_id } = request;

    try {
      const result = await this.RoomsUserCase.create(email, user_id);

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    const { email } = request.params;
    const { user_id } = request;
    try {
      const result = await this.RoomsUserCase.find(email, user_id);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { RoomsController };
