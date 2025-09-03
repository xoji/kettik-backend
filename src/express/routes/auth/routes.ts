import { Router } from "express";
import { AuthController } from "./controller";
// import { apiLimiter } from "../../../utils/apiLimiter";
import { userGuardMiddleware } from "../../middleware/user-guard-middleware";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.post("/submit", controller.submit);
router.post("/resend-otp", controller.resend);
router.patch("/sign-out", userGuardMiddleware(true), controller.signOut);

export default router;
