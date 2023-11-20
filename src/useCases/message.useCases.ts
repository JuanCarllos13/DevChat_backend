import { HttpException } from "../interfaces/HttpExceptions";
import { IGetHistoric } from "../interfaces/message.interface";
import { MessageRepository } from "../repositories/message.repositories";
import { UsersRepository } from "../repositories/user.repositories";

class Message {
  private messageRepository: MessageRepository;
  private userRepository: UsersRepository;
  constructor() {
    this.messageRepository = new MessageRepository();
    this.userRepository = new UsersRepository();
  }

  async create(
    user_id: string,
    email_to_user: string,
    message_from_user: string,
    room_id: string
  ) {
    const findUserByEmail = await this.userRepository.findUserByEmail({
      email: email_to_user,
    });

    if (!findUserByEmail) {
      throw new HttpException(400, "User not found");
    }

    await this.messageRepository.create({
      to_user_id: findUserByEmail.id,
      from_user_id: user_id,
      bodyMessage: message_from_user,
      room_id,
    });
    return { message: "save message" };
  }
  async updateView(room_id: string, user_id: string, email_to_user: string) {
    const findUserByEmail = await this.userRepository.findUserByEmail({
      email: email_to_user,
    });

    if (!findUserByEmail) {
      throw new HttpException(400, "User not found");
    }

    const updateMessagesUser = this.messageRepository.updateMessage(
      room_id,
      user_id,
      findUserByEmail.id
    );

    return updateMessagesUser;
  }

  async getHistoric({ emailDestinatary, pageNumber, userId }: IGetHistoric) {
    const findUserByEmail = await this.userRepository.findUserByEmail({
      email: emailDestinatary,
    });

    if(!findUserByEmail){
      throw new HttpException(400, "User not found")
    }
    const message = await this.messageRepository.getHistoric({
      userId,
      userIdDestinatary: findUserByEmail.id,
      pageNumber
    })

    return message
  }
}

export { Message };
