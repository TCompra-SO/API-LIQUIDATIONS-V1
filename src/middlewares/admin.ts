import { NextFunction, Response } from "express";
import { RequestExt } from "../interfaces/req-ext";
import axios from "axios";

const checkIfIsSystemAdmin = async (
  req: RequestExt,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({
        success: false,
        code: 401,
        error: {
          msg: "NO_SYS_ADMIN",
        },
      });
    }

    const userBase = await axios.get(
      `${process.env.API_USER}auth/checkIfIsSystemAdmin/${userId}`
    );
    if (!userBase.data.success) {
      return res.status(401).send({
        success: false,
        code: 401,
        error: {
          msg: "NO_SYS_ADMIN",
        },
      });
    }
    if (!userBase.data.data.isSystemAdmin)
      return res.status(401).send({
        success: false,
        code: 401,
        error: {
          msg: "NO_SYS_ADMIN",
        },
      });

    next();
  } catch (e) {
    res.status(400).send({
      success: false,
      code: 400,
      error: {
        msg: "NO_SYS_ADMIN",
      },
    });
  }
};

export { checkIfIsSystemAdmin };
