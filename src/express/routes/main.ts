import { Router } from "express";
import authRoutes from "./auth/routes";
import deviceRoutes from "./device/routes";
import userRoutes from "./user/routes";
import listingMiddleware from "./listing/routes";
import driverRoutes from "./driver/routes";
import { deviceGuardMiddleware } from "../middleware/device-middleware";
import { userGuardMiddleware } from "../middleware/user-guard-middleware";
const routes = Router();

routes.use("/device", deviceRoutes);
routes.use(deviceGuardMiddleware);
routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/listing", listingMiddleware);
routes.use("/driver", userGuardMiddleware(true), driverRoutes);

export default routes;
