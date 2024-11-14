import { Router } from "express";
import {
  createRequerimentController,
  expiredController,
  getbasicRateDataController,
  getRequerimentIDController,
  getRequerimentsByEntityController,
  getRequerimentsBySubUserController,
  getRequerimentsController,
  selectOfferController,
} from "../controllers/requerimentController";

export class RequerimentRouter {
  private static instance: RequerimentRouter;
  private router: Router;

  private constructor() {
    this.router = Router();
    this.router.post("/create", createRequerimentController);
    this.router.post("/selectOffer", selectOfferController);

    this.router.get("/getRequeriments", getRequerimentsController);
    this.router.get("/getRequeriment/:uid", getRequerimentIDController);
    this.router.get("/getBasicRateData/:uid", getbasicRateDataController);
    this.router.get("/expired", expiredController);
    this.router.get(
      "/getRequerimentsByEntity/:uid",
      getRequerimentsByEntityController
    );
    this.router.get(
      "/getRequerimentsBySubUser/:uid",
      getRequerimentsBySubUserController
    );
  }

  static getRouter(): Router {
    if (!RequerimentRouter.instance) {
      RequerimentRouter.instance = new RequerimentRouter();
    }
    return RequerimentRouter.instance.router;
  }
}
