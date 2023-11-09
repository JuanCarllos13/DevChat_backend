import { HttpException } from "../interfaces/HttpExceptions";
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
      body_message: message_from_user,
      room_id,
    });

    return { message: "save message" };
  }

  async updateView(room_id: string, user_id: string, email_to_user: string) {
    const findUserByEmail = await this.userRepository.findUserByEmail({
      email: email_to_user,
    });

    console.log("find", findUserByEmail)

    if (!findUserByEmail) {
      throw new HttpException(400, "User not found");
    }

    const updateMessageUser = await this.messageRepository.updateMessage(
      room_id,
      user_id,
      findUserByEmail.id
    );

    console.log("aq", updateMessageUser)

    return updateMessageUser;
  }
}

export { Message };
