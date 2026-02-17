import { Request, Response } from "express";
import { statisticsService } from "../services/statistics.service";

export const statisticsController = async (req: Request, res: Response) => {
  try {
    const result = await statisticsService();

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "No data found in db",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Statistics data make", data: result });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};