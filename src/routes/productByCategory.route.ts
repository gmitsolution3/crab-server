import { Router } from "express";
import { getProductByCategory } from "../controllers/productByCategory.controller";


const router = Router();


router.get("/:category", getProductByCategory);



export default router