import { Router } from "express";
import { UserController } from "./controller";
import { userGuardMiddleware } from "../../middleware/user-guard-middleware";

const router = Router();
const controller = new UserController();

router.post(
  "/identification",
  userGuardMiddleware(true),
  controller.identification,
);
router.post(
  "/complete-identification",
  userGuardMiddleware(true),
  controller.completeIdentification,
);
router.post(
  "/update",
  userGuardMiddleware(true),
  controller.changeProfileImage,
);

// router.get("/single");
// router.get("/all");
// router.post("/update/:id");

export default router;
