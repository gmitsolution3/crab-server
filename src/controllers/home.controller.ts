import { Request, Response } from "express";
import * as homeService from "../services/home.service";

export const getHomeData = async (_req: Request, res: Response) => {
  const result = await homeService.getHomeData();

  return res.status(200).json({
    success: true,
    message: "Home page data",
    data: result,
  });
};
