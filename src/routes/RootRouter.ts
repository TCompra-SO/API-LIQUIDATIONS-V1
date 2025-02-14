import { Router } from "express";
import { RequerimentRouter } from "./requerimentRouter";
import { OfferRouter } from "./offerRouter";
import { ImageRouter } from "./imageRouter";
import { FileRouter } from "./fileRouter";
import { SaleOrderRouter } from "./saleOrderRouter";
import { checkJwt } from "../middlewares/session";

export class RootRouter {
  private static instance: RootRouter;
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.use("/v1/requeriments/", RequerimentRouter.getRouter());
    this.router.use("/v1/offers/", checkJwt, OfferRouter.getRouter());
    this.router.use("/v1/images/", ImageRouter.getRouter());
    this.router.use("/v1/documents/", FileRouter.getRouter());
    this.router.use("/v1/saleOrder/", SaleOrderRouter.getRouter());
  }

  static getRouter(): Router {
    if (!RootRouter.instance) {
      RootRouter.instance = new RootRouter();
    }
    return RootRouter.instance.router;
  }
}
