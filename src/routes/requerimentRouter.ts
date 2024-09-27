import { Router } from "express";
import {
  createRequerimentController,
  getRequerimentsController,
} from "../controllers/requerimentController";
export class RequerimentRouter {
  private static instance: RequerimentRouter;
  private router: Router;

  private constructor() {
    this.router = Router();
    this.router.post("/create", createRequerimentController);

    this.router.get("/getRequeriments", getRequerimentsController);
  }

  static getRouter(): Router {
    if (!RequerimentRouter.instance) {
      RequerimentRouter.instance = new RequerimentRouter();
    }
    return RequerimentRouter.instance.router;
  }
}
