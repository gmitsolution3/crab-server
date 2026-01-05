import { Router } from "express";
import {
  addProduct,
  getAllProduct,
  getDeleteProduct,
  getDraftProduct,
  getProductBySku,
  getProductDetails,
} from "../controllers/product.controller";

const router = Router();

router.post("/", addProduct);
router.get("/", getAllProduct);
router.get("/", getProductBySku);
router.get("/draft", getDraftProduct);
router.get("/delete-product", getDeleteProduct);
router.get("/:slug", getProductDetails);

export default router;
