import { Router } from "express";
import * as homeController from "../controllers/home.controller";

const router = Router();

router.get("/", homeController.getHomeData);


export default router;