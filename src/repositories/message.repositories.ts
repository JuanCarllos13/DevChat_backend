import { MessageModel } from "../infra/models/message.model";
import { IMessage } from "../interfaces/message.interface";

class MessageRepository {
  async create({ to_user_id, from_user_id, body_message }: IMessage) {
    const result = await MessageModel.create({
      from_user_id,
      to_user_id,
      body: body_message,
      viewed_by_the_user: false,
    });

    return result;
  }

  async findMessageRoom(room_id: string, user_id: string, to_user_id: string) {
    const result = await MessageModel.find({
      room_id: room_id,
      from_user_id: user_id,
      to_user_id: to_user_id,
      viewed_by_the_user: false,
    });

    return result;
  }

  async updateMessage(room_id: string, user_id: string, to_user_id: string) {
    const result = await MessageModel.updateMany(
      {
        room_id,
        from_user_id: user_id,
        to_user_id,
        viewed_by_the_user: false,
      },
      {
        $set: { viewed_by_the_user: true },
      }
    );

    console.log('e', result)

    return result;
  }
}

export { MessageRepository };
