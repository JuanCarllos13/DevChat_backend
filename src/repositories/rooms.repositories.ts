import { RoomsModel } from "../infra/models/rooms.model";
import { UsersModel } from "../infra/models/users.model";
import { ICreateRoom } from "../interfaces/rooms.interface";

class RoomsRepository {
  async create({ user_id_joined_room, user_id_created_room }: ICreateRoom) {
    const result = await RoomsModel.create({
      user_id_joined_room,
      user_id_created_room,
    });

    return result;
  }
}

export { RoomsRepository };
