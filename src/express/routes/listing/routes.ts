import { Router } from "express";
import { ListingController } from "./controller";

const router = Router();
const controller = new ListingController();

export default router;
