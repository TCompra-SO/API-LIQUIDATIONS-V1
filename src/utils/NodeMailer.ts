import nodemailer from "nodemailer";
import { SaleOrderI } from "../interfaces/saleOrder.interface";
import { OrderSaleTemplate } from "./OrderSaleTemplate";
import { SaleOrderService } from "../services/saleOrderService";
export const sendEmailSaleOrder = async (
  data: Omit<SaleOrderI, "uid">,
  emailUser: string
) => {
  const html = await OrderSaleTemplate(data);
  const pdfBuffer = await SaleOrderService.createPDF(html);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tcompraperu@gmail.com",
      pass: "uzof pfmc lcwz kgko",
    },
  });

  const mailOptions = {
    from: '"TCOMPRA" <tcompraperu@gmail.com>', // Cambia al correo de la empresa si es necesario
    to: emailUser,
    subject: `Se aceptó tu oferta para la Liquidación: ${data.requerimentTitle}`,
    html: `${await OrderSaleTemplate(data)}`,
    attachments: [
      {
        filename: `orden_de_compra_${data.userClientID}.pdf`,
        content: pdfBuffer, // Adjuntar el PDF generado
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mensaje enviado: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return { success: false, error: error };
  }
};
