import { Router } from "express";
import { logInController, SignUpController } from "../controllers/auth.controller";


const router = Router();


router.post("/sign-in",logInController)

router.post("/sign-up",SignUpController)


export default router