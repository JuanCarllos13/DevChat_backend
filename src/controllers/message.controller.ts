import { NextFunction, Request, Response } from "express";
import { Message } from "../useCases/message.useCases";

class MessageController {
  private messageUserCase: Message;
  constructor() {
    this.messageUserCase = new Message();
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { message } = request.body;

    const { user_id } = request;
    try {
      const email_from_user = message.email;
      const message_from_user = message.body_message;
      const room_id = message.room_id;

      const result = await this.messageUserCase.create(
        user_id,
        email_from_user,
        message_from_user,
        room_id
      );

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateView(request: Request, response: Response, next: NextFunction) {
    // Buscar o Id da room
    // Filtrar todas as messages não lidas daqueles usuário que esta recebendo a mensagem (to_user_id)
    // ordenar por ordem decrescente que não estão lidas
    const { room_id, email_to_user } = request.body;
    const { user_id } = request;

    try {
      const result = await this.messageUserCase.updateView(
        room_id,
        user_id,
        email_to_user
      );

      console.log(result);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { MessageController };
