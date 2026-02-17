import { Router } from "express";
import { statisticsController } from "../controllers/statistics.controller";


const router = Router();


router.get("/", statisticsController);


export default router