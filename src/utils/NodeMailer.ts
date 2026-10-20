import nodemailer from "nodemailer";
import { SaleOrderI } from "../interfaces/saleOrder.interface";
import { OrderSaleTemplate } from "./OrderSaleTemplate";
import { SaleOrderService } from "../services/saleOrderService";
export const sendEmailSaleOrder = async (
  data: Omit<SaleOrderI, "uid">,
  emailUser: string,
) => {
  const html = await OrderSaleTemplate(data);
  const pdfBuffer = await SaleOrderService.createPDF(html);

  const FROM_EMAIL = process.env.SMTP_USER || "contacto@tcompra.com";
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // false en 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"TCOMPRA" <${FROM_EMAIL}>`, // Cambia al correo de la empresa si es necesario
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
