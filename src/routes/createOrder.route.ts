import { Router } from "express";
import {
  CreateOrder,
  orderController,
} from "../controllers/createOrder.controller";

const router = Router();

router.post("/", CreateOrder);

router.get("/all-product", orderController);

export default router;
