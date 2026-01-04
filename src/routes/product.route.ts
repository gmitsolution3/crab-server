import { Router } from "express";
import {
  addProduct,
  getAllProduct,
  getProductBySku,
  getProductDetails,
} from "../controllers/product.controller";

const router = Router();

router.post("/", addProduct);

router.get("/", getAllProduct);
router.get("/:slug", getProductDetails);

router.get("/", getProductBySku);


export default router;
