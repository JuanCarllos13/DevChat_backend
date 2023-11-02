import mongoose from "mongoose";
import { HttpException } from "../../interfaces/HttpExceptions";

export async function connected() {
  if (!process.env.MONGO_DB_HOST) {
    throw new HttpException(498, ".env not found");
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_HOST);
    console.log("Connected ao banco");
  } catch (e) {
    console.log("Erro ao Conectar no banco de dados.", e);
  }
}
