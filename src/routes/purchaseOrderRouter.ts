import { Router } from "express";
import {
  CreateSaleOrderController,
  getSaleOrdersClientController,
  getSaleOrdersProviderController,
  getSaleOrderIDController,
  getSaleOrdersController,
  getSaleOrderPDFController,
  getSaleOrdersByProvider,
  getSaleOrdersByClient,
  canceledController,
  searchSaleOrdersByProviderController,
  searchSaleOrdersByClientController,
} from "../controllers/saleOrderController";

export class SaleOrderRouter {
  private static instance: SaleOrderRouter;
  private router: Router;

  private constructor() {
    this.router = Router();

    // ORDEN DE COMPRA
    this.router.post("/createSaleOrder", CreateSaleOrderController);
    this.router.post(
      "/searchSaleOrdersByProvider",
      searchSaleOrdersByProviderController
    );
    this.router.post(
      "/searchSaleOrdersByClient",
      searchSaleOrdersByClientController
    );
    this.router.get("/getSaleOrders/:page/:pageSize", getSaleOrdersController);
    this.router.get(
      "/getSaleOrdersClient/:userClientID/:page/:pageSize",
      getSaleOrdersClientController
    );
    this.router.get(
      "/getSaleOrdersProvider/:userProviderID/:page/:pageSize",
      getSaleOrdersProviderController
    );

    this.router.get("/getSaleOrderID/:uid", getSaleOrderIDController);
    this.router.get("/getSaleOrderPDF/:uid", getSaleOrderPDFController);
    this.router.get(
      "/getSaleOrdersByProvider/:uid/:typeUser/:page/:pageSize",
      getSaleOrdersByProvider
    );
    this.router.get(
      "/getSaleOrdersByClient/:uid/:typeUser/:page/:pageSize",
      getSaleOrdersByClient
    );

    this.router.get("/canceled/:saleOrderID", canceledController);
  }

  static getRouter(): Router {
    if (!SaleOrderRouter.instance) {
      SaleOrderRouter.instance = new SaleOrderRouter();
    }
    return SaleOrderRouter.instance.router;
  }
}
