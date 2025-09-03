import { Router } from "express";
import { DeviceRouteController } from "./controller";
import { deviceGuardMiddleware } from "../../middleware/device-middleware";
import { apiLimiter } from "../../../utils/apiLimiter";

const router = Router();
const controller = new DeviceRouteController();

router.post("/create", controller.create);
router.post("/update", deviceGuardMiddleware, controller.update);

export default router;
