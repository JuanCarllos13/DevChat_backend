import http from "http";
import express, { Application, NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { UserRoutes } from "./routes/user.routes";
import { connected } from "./infra/database";
import fs from "fs";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middlewares";
import { RoomsRoutes } from "./routes/rooms.routes";
import { MessageRoutes } from "./routes/message.routes";

class App {
  public app: Application;
  private http: http.Server;
  private io: Server;
  private userRoutes = new UserRoutes();
  private roomsRoutes = new RoomsRoutes();
  private MessageRoutes = new MessageRoutes();

  constructor() {
    this.app = express();
    this.http = new http.Server(this.app);
    this.middlewaresInitialize();
    this.io = new Server(this.http);
    this.initializeRoutes();
    this.initializeHtml();
    this.interceptionError();
  }

  listen() {
    this.http.listen(3333, async () => {
      try {
        dotenv.config();
        await connected();
        console.log("Server is running");
      } catch (error) {}
    });
  }
  listenSocket() {
    this.io.on("connection", (socket) => {
      socket.on("join_room", (room_id) => {
        socket.join(room_id);
      });

      socket.on("message", (data) => {
        socket.to(data.room_id).emit("message", data.message)
      })
    });
  }

  private initializeHtml() {
    this.app.get("/", (req, res) => {
      console.log("html is running");
      res.sendFile(__dirname + "/index.html");
    });
  }
  private middlewaresInitialize() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    fs.accessSync(`.env`, fs.constants.F_OK);
  }

  private initializeRoutes() {
    this.app.use("/users", this.userRoutes.router);
    this.app.use("/rooms", this.roomsRoutes.router);
    this.app.use("/messages", this.MessageRoutes.router)
  }

  private interceptionError() {
    this.app.use(errorMiddleware);
  }
}

export { App };
