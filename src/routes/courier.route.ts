import { Router } from "express";
import { assignCourier } from "../controllers/courier.controller";

const router = Router();

router.post("/assign", assignCourier);

export default router;
