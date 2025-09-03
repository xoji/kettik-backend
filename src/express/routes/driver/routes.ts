import { Router } from "express";
import { DriverController } from "./controller";

const router = Router();
const controller = new DriverController();

router.post("/create", controller.create);

export default router;
