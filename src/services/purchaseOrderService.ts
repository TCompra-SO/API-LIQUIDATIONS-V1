import axios from "axios";
import {
  PurchaseOrderI,
  PurchaseOrderState,
  TypeRequeriment,
} from "../interfaces/purchaseOrder.interface";
import PurchaseOrderModel from "../models/purchaseOrder";
import { OfferService } from "./offerService";
import { igv } from "../initConfig";
import { RequerimentService } from "./requerimentService";
import { sendEmailPurchaseOrder } from "../utils/NodeMailer";
import { number } from "joi";
import puppeteer from "puppeteer";
import { Buffer } from "node:buffer";
import { OrderPurchaseTemplate } from "../utils/OrderPurchaseTemplate";
import { launch } from "./../../node_modules/@puppeteer/browsers/lib/esm/launch";
import { error } from "node:console";

let API_USER = process.env.API_USER;
export class PurchaseOrderService {
  static CreatePurchaseOrder = async (
    requerimentID: string,
    offerID: string,
    price_Filter: number,
    deliveryTime_Filter: number,
    location_Filter: number,
    warranty_Filter: number
  ) => {
    try {
      const offerBasicData = OfferService.BasicRateData(offerID);
      const offerData = OfferService.GetDetailOffer(offerID);
      const userProviderID = (await offerBasicData).data?.[0].userId;
      const subUserProviderID = (await offerBasicData).data?.[0].subUserId;

      const requerimentBasicData =
        RequerimentService.BasicRateData(requerimentID);
      const requerimentData =
        RequerimentService.getRequerimentById(requerimentID);
      const userClientID = (await requerimentBasicData).data?.[0].userId;
      const subUserClientID = (await requerimentBasicData).data?.[0].subUserId;

      if (requerimentID !== (await offerData).data?.[0].requerimentID) {
        return {
          success: false,
          code: 404,
          error: {
            msg: "La oferta seleccionada no pertenece a este requerimiento",
          },
        };
      }

      if ((await offerData).data?.[0].stateID !== 1) {
        return {
          success: false,
          code: 401,
          error: {
            msg: "La Oferta no puede ser seleccionada",
          },
        };
      }
      const userProviderData = await axios.get(
        `${API_USER}auth/getBaseDataUser/${subUserProviderID}`
      );

      const basicProviderData = await axios.get(
        `${API_USER}auth/getUser/${userProviderID}`
      );

      const baseClientData = await axios.get(
        `${API_USER}auth/getUser/${userClientID}`
      );

      const currencyData = await axios.get(`${API_USER}util/utilData/currency`);

      const currencyId = (await requerimentData).data?.[0].currencyID; // Cambia este valor al ID que deseas buscar
      const currencyValue = currencyData.data.currencies.find(
        (currency: { id: number; value: string; alias: string }) =>
          currency.id === currencyId
      )?.alias;

      const daysDeliveryData = await axios.get(
        `${API_USER}util/utilData/delivery_time`
      );
      console.log(daysDeliveryData.data?.times);
      const deliveryTimeID = (await offerData).data?.[0].deliveryTimeID;
      let days = 0;
      let deliveryDate;
      if (deliveryTimeID !== 6) {
        deliveryDate = new Date();
        days = daysDeliveryData.data.times.find(
          (days: { id: number; value: string; days: number }) =>
            days.id === deliveryTimeID
        )?.days;

        deliveryDate.setDate(deliveryDate.getDate() + days);
      } else {
        deliveryDate = null;
      }

      console.log(deliveryDate);
      console.log(currencyValue);

      if (!(await offerBasicData).success) {
        return {
          success: false,
          code: 403,
          error: {
            msg: "No se encontro la Oferta",
          },
        };
      }

      let price = (await offerData).data?.[0].budget;
      let subTotal = price;
      let total, totalIgv;
      if (!(await offerData).data?.[0].includesIGV) {
        totalIgv = ((await offerData).data?.[0].budget * igv) / 100;
        totalIgv = parseFloat(totalIgv.toFixed(2));
        total = subTotal + totalIgv;
      } else {
        subTotal = price / (1 + igv / 100);
        subTotal = parseFloat(subTotal.toFixed(2));
        totalIgv = parseFloat((price - subTotal).toFixed(2));
        total = price;
      }
      const newPurchaseOrder: Omit<PurchaseOrderI, "uid"> = {
        type: TypeRequeriment.PRODUCTS,
        userClientID: userClientID,
        userNameClient: (await requerimentBasicData).data?.[0].userName,
        addressClient: (await baseClientData).data.data?.[0].address,
        documentClient: (await baseClientData).data.data?.[0].document,
        emailClient: (await requerimentData).data?.[0].email,
        subUserClientID: subUserClientID,
        subUserClientEmail: (await requerimentData).data?.[0].subUserEmail,
        nameSubUserClient: (await requerimentBasicData).data?.[0].subUserName,
        createDate: new Date(),
        deliveryDate: deliveryDate,
        requerimentID: requerimentID,
        requerimentTitle: (await offerData).data?.[0].requerimentTitle,
        currency: currencyValue,
        price: price,
        subtotal: subTotal,
        totaligv: totalIgv,
        total: total,
        igv: igv,
        userProviderID: userProviderID,
        nameUserProvider: (await offerBasicData).data?.[0].userName,
        subUserProviderID: subUserProviderID,
        nameSubUserProvider: (await offerBasicData).data?.[0].subUserName,
        subUserEmailProvider: (await offerBasicData).data?.[0].subUserEmail,
        addressProvider: (await basicProviderData).data.data?.[0].address,
        documentProvider: (await userProviderData).data.data?.[0].document,
        emailProvider: (await offerData).data?.[0].email,
        state: PurchaseOrderState.PENDING,
        offerID: (await offerData).data?.[0].uid,
        offerTitle: (await offerData).data?.[0].name,
        price_Filter,
        deliveryTime_Filter,
        location_Filter,
        warranty_Filter,
      };

      const CreateOrder = new PurchaseOrderModel(newPurchaseOrder);
      await CreateOrder.save();
      const sendMail = sendEmailPurchaseOrder(newPurchaseOrder);
      let responseEmail = "";
      if ((await sendMail).success) {
        responseEmail = "Orden de Compra enviada al Email correctamente";
      } else {
        responseEmail = "No se ha podido enviar la Orden al Correo";
      }
      return {
        success: true,
        code: 200,
        res: {
          msg: "Se ha creaqdo correctamente la orden de Compra",
          responseEmail: responseEmail,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        code: 500,
        error: {
          msg: "Error interno en el Servidor, no se ha podido Crear la Orden de Compra",
        },
      };
    }
  };

  static getPurchaseOrders = async () => {
    try {
      const result = await PurchaseOrderModel.find();
      return {
        success: true,
        code: 200,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        code: 500,
        error: {
          msg: "Error interno con el Servidor",
        },
      };
    }
  };

  static getPurchaseOrderByUser = async (userClientID: string) => {
    try {
      const result = await PurchaseOrderModel.find({ userClientID });

      return {
        success: true,
        code: 200,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        code: 500,
        error: {
          res: "Se ha producido un error interno en el Servidor",
        },
      };
    }
  };

  static getPurchaseOrderID = async (uid: string) => {
    try {
      const result = await PurchaseOrderModel.findOne({ uid });
      if (!result) {
        return {
          success: false,
          code: 403,
          error: {
            msg: "Orden de Compra no encontrada",
          },
        };
      }

      return {
        success: true,
        code: 200,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        code: 500,
        error: {
          msg: "Error interno en el Servidor",
        },
      };
    }
  };

  static createPDF = async (htmlContent: string): Promise<Buffer> => {
    // Iniciar el navegador de Puppeteer
    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"], // Deshabilitar sandbox
    });

    const page = await browser.newPage();

    // Establecer el contenido HTML
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generar el PDF como Buffer (con formato A4)
    const pdfBuffer = (await page.pdf({
      format: "A4",
      printBackground: true,
    })) as Buffer;

    // Cerrar el navegador
    await browser.close();

    // Retornar el buffer del PDF
    return pdfBuffer;
  };

  static getPurchaseOrderPDF = async (uid: string) => {
    try {
      const data = await this.getPurchaseOrderID(uid);
      if (data && data.success && data.data) {
        const html = await OrderPurchaseTemplate(data.data);

        // Genera el PDF a partir de la plantilla HTML
        const pdfBuffer: Buffer = await this.createPDF(html);

        // Convierte el PDF a base64
        const pdfBase64 = pdfBuffer.toString("base64");

        return {
          success: true,
          code: 200,
          data: pdfBase64,
        };
      } else {
        return {
          success: false,
          code: 403,
          error: {
            msg: "No se ha encontrado la Orden de Compra",
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        code: 500,
        error: {
          msg: "Error al generar el PDF",
        },
      };
    }
  };
}
