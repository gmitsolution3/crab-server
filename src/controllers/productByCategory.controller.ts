import { Request, Response } from "express";
import { FindProductByCategory } from "../services/productByCategory.service";

export const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(500).json({
        success: false,
        message: "CategoryId is missing",
      });
    }

    const result = await FindProductByCategory(category);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, error: err });
  }
};
