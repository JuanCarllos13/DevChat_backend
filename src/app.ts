import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import { connected } from "./infra/database";
import { errorMiddleware } from "./middlewares/error.middlewares";
import { MessageRoutes } from "./routes/message.routes";
import { RoomsRoutes } from "./routes/rooms.routes";
import { UserRoutes } from "./routes/user.routes";
class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  private userRoutes = new UserRoutes();
  private roomsRoutes = new RoomsRoutes();
  private messageRoutes = new MessageRoutes();

  constructor() {
    this.app = express();
    this.http = new http.Server(this.app);
    this.io = new Server(this.http);
    this.middlewaresInitalize();
    this.initializeRoutes();
    this.interceptionError();
    this.initializeHtml();
  }
  listen() {
    this.http.listen(3333, async () => {
      try {
        dotenv.config();
        await connected();
        console.log("Conectado ao banco de dados");
      } catch (error) {
        console.log(
          "🚀 ~ file: app.ts:26 ~ App ~ this.http.listen ~ error:",
          error
        );
      }
    });
  }
  listenSocket() {
    const userStatus: string[] = [];
    this.io.on("connection", (userSocket) => {
      userSocket.on("join_room", (room_id) => {
        userSocket.join(room_id);
      });
      userSocket.on("user_connected", (user_id) => {
        userStatus.push(user_id);
        this.io.emit("updateUserStatus", userStatus);
      });

      userSocket.on("message", (data) => {
        console.log("🚀 ~ file: app.ts:56 ~ App ~ userSocket.on ~ data:", data);
        userSocket.to(data.room_id).emit("room_message", data.message);
      });
      userSocket.on("disconnect", () => {
        const user_id = userSocket.handshake.query.user_id;
        if (!user_id || typeof user_id !== "string") return;

        userStatus.splice(userStatus.indexOf(user_id), 1);
        this.io.emit("updateUserStatus", userStatus);
      });
    });
  }
  private initializeHtml() {
    this.app.get("/index", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });
  }
  private initializeRoutes() {
    this.app.use("/users", this.userRoutes.router);
    this.app.use("/rooms", this.roomsRoutes.router);
    this.app.use("/messages", this.messageRoutes.router);
  }
  private middlewaresInitalize() {
    this.app.use(express.json());
    this.app.use("/uploads", express.static(__dirname + "/tmp/uploads"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    fs.accessSync(".env", fs.constants.F_OK);
  }
  private interceptionError() {
    this.app.use(errorMiddleware);
  }
}

export { App };
