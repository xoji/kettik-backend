import { Router } from "express";
import { BillingController } from "./controller";

const router = Router();
const controller = new BillingController();

export default router;
