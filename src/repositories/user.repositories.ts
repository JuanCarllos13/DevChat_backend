import { UsersModel } from "../infra/models/users.model";
import {
  ICreateUser,
  IEmail,
  IPagination,
} from "../interfaces/users.interface";

class UsersRepository {
  async create({ email, name, password }: ICreateUser) {
    const result = await UsersModel.create({ name, email, password });

    return result;
  }

  async findUserByEmail({ email }: IEmail) {
    const result = await UsersModel.findOne({ email });

    return result;
  }

  async findAllUsers({ pageNumber, pageSize }: IPagination) {
    const result = await UsersModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return result;
  }
}

export { UsersRepository };
