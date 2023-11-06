import { sign } from "jsonwebtoken";
import { UsersModel } from "../infra/models/users.model";
import { IAuth, ICreateUser, IPagination } from "../interfaces/users.interface";
import { UsersRepository } from "../repositories/user.repositories";
import { compare, hash } from "bcrypt";
import { HttpException } from "../interfaces/HttpExceptions";

class User {
  private userRepository: UsersRepository;
  constructor() {
    this.userRepository = new UsersRepository();
  }

  async createUser({ email, name, password }: ICreateUser) {
    const findUser = await this.userRepository.findUserByEmail({
      email,
    });

    if (findUser) {
      throw new HttpException(400, "User already exists");
    }

    const hasPassword = await hash(password, 10);

    const result = await this.userRepository.create({
      name,
      email,
      password: hasPassword,
    });

    return result;
  }

  update() {}

  async auth({ email, password }: IAuth) {
    const findUser = await this.userRepository.findUserByEmail({
      email,
    });

    if (!findUser) {
      throw new HttpException(400, "User already exists");
    }

    const passwordMatch = await compare(password, findUser?.password!);

    if (!passwordMatch) {
      throw new HttpException(400, "User or password invalid");
    }

    let secretKey = process.env.TOKEN_SECRET;

    if (!process.env.TOKEN_SECRET) {
      throw new HttpException(498, "TOKEN_SECRET not found");
    }

    if (!secretKey) {
      throw new HttpException(498, "There is no secret key");
    }

    const token = sign(
      { name: findUser.name!, user_id: findUser.id, email },
      secretKey,
      {
        expiresIn: "7d", // expires in 7 days
      }
    );

    return {
      token,
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    };
  }

  findAllUsers({ pageNumber, pageSize }: IPagination) {
    const result = this.userRepository.findAllUsers({ pageNumber, pageSize });

    return result;
  }
}

export { User };
