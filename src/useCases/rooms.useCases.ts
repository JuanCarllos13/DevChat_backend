import { HttpException } from "../interfaces/HttpExceptions";
import { RoomsRepository } from "../repositories/rooms.repositories";
import { UsersRepository } from "../repositories/user.repositories";

class Rooms {
  private userRepository: UsersRepository;
  private roomsRepository: RoomsRepository;
  constructor() {
    this.roomsRepository = new RoomsRepository();
    this.userRepository = new UsersRepository();
  }

  async create(email: string, user_id: string) {
    const findDestinationUserId = await this.userRepository.findUserByEmail({
      email,
    });

    if (!findDestinationUserId) {
      throw new HttpException(400, "User not found");
    }

    const result = await this.roomsRepository.create({
      user_id_joined_room: findDestinationUserId.id,
      user_id_created_room: user_id,
    });

    return result;
  }
}

export { Rooms };
