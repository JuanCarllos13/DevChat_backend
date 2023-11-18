import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { upload } from "../infra/multer/config";

class UserRoutes {
  public router: Router;
  private usersController = new UserController();

  constructor() {
    this.router = Router();
    this.getRoutes();
  }

  getRoutes() {
    this.router.post(
      "/",
      this.usersController.store.bind(this.usersController)
    );
    this.router.post(
      "/auth",
      this.usersController.auth.bind(this.usersController)
    );

    this.router.get(
      "/",
      authMiddleware,
      this.usersController.getAllUsers.bind(this.usersController)
    );

    this.router.post(
      "/upload",
      authMiddleware, upload.single("image"),
      this.usersController.upload.bind(this.usersController)
    );
  }
}

export { UserRoutes };
