import { Request, Response } from "express";
import { SaleOrderService } from "../services/saleOrderService";
const fs = require("fs");

const CreateSaleOrderController = async (req: Request, res: Response) => {
  try {
    const {
      requerimentID,
      offerID,
      price_Filter,
      deliveryTime_Filter,
      location_Filter,
      warranty_Filter,
    } = req.body;
    const responseUser = await SaleOrderService.CreateSaleOrder(
      requerimentID,
      offerID,
      price_Filter,
      deliveryTime_Filter,
      location_Filter,
      warranty_Filter
    );

    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en CreateSaleOrderController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrdersController = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.params;
    const responseUser = await SaleOrderService.getSaleOrders(
      Number(page),
      Number(pageSize)
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getPurchaseOrdersController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrdersProviderController = async (req: Request, res: Response) => {
  const { userProviderID, page, pageSize } = req.params;
  try {
    const responseUser = await SaleOrderService.getSaleOrdersProvider(
      userProviderID,
      Number(page),
      Number(pageSize)
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getSaleOrderByEntityProviderController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrdersClientController = async (req: Request, res: Response) => {
  const { userClientID, page, pageSize } = req.params;
  try {
    const responseUser = await SaleOrderService.getSaleOrdersClient(
      userClientID,
      Number(page),
      Number(pageSize)
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getSaleOrderByEntityClientController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrderIDController = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const responseUser = await SaleOrderService.getSaleOrderID(uid);
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getSaleOrderIDController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrdersByProvider = async (req: Request, res: Response) => {
  const { uid, typeUser, page, pageSize } = req.params;
  try {
    const responseUser = await SaleOrderService.getSaleOrdersByEntityProvider(
      uid,
      Number(typeUser),
      Number(page),
      Number(pageSize)
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getSaleOrdersByProviderController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrdersByClient = async (req: Request, res: Response) => {
  const { uid, typeUser, page, pageSize } = req.params;
  try {
    const responseUser = await SaleOrderService.getSaleOrdersByEntityClient(
      uid,
      Number(typeUser),
      Number(page),
      Number(pageSize)
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getSaleOrdersByClientController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const getSaleOrderPDFController = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const responseUser = await SaleOrderService.getSaleOrderPDF(uid);
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en getSaleOrderPDFController", error);
    return res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const canceledController = async (req: Request, res: Response) => {
  const { saleOrderID } = req.params;
  try {
    const responseUser = await SaleOrderService.canceled(saleOrderID);
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en canceledController", error);
    return res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const searchSaleOrdersByProviderController = async (
  req: Request,
  res: Response
) => {
  const {
    keyWords,
    typeUser,
    userId,
    page,
    pageSize,
    fieldName,
    orderType,
    filterColumn,
    filterData,
  } = req.body;
  try {
    const responseUser = await SaleOrderService.searchSaleOrderByProvider(
      keyWords,
      typeUser,
      userId,
      Number(page),
      Number(pageSize),
      fieldName,
      Number(orderType),
      filterColumn,
      filterData
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en searchSaleOrdersByProviderController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

const searchSaleOrdersByClientController = async (
  req: Request,
  res: Response
) => {
  const {
    keyWords,
    typeUser,
    userId,
    page,
    pageSize,
    fieldName,
    orderType,
    filterColumn,
    filterData,
  } = req.body;
  try {
    const responseUser = await SaleOrderService.searchSaleOrderByClient(
      keyWords,
      typeUser,
      userId,
      Number(page),
      Number(pageSize),
      fieldName,
      Number(orderType),
      filterColumn,
      filterData
    );
    if (responseUser && responseUser.success) {
      res.status(responseUser.code).send(responseUser);
    } else {
      res.status(responseUser.code).send(responseUser.error);
    }
  } catch (error) {
    console.error("Error en searchSaleOrdersByClientController", error);
    res.status(500).send({
      success: false,
      msg: "Error interno del Servidor",
    });
  }
};

export {
  CreateSaleOrderController,
  getSaleOrdersController,
  getSaleOrdersProviderController,
  getSaleOrdersClientController,
  getSaleOrderIDController,
  getSaleOrderPDFController,
  getSaleOrdersByProvider,
  getSaleOrdersByClient,
  canceledController,
  searchSaleOrdersByProviderController,
  searchSaleOrdersByClientController,
};
