import { createClient } from "redis";
global.redis = createClient();
import { PrismaClient } from "./generated/prisma/index";
global.database = new PrismaClient();
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};
import express from "express";
import fileUpload from "express-fileupload";
import { variables } from "./variable";
import appRoutes from "./express/routes/main";
import { ConsoleLogger } from "./utils/logger";
import { deviceMiddleware } from "./express/middleware/device-middleware";
import { inputSanitizerMiddleware } from "./express/middleware/guard-middleware";
import { checkSignature } from "./express/middleware/routes-guard-middleware";
import billingRoutes from "./express/routes/billing/routes";
import routes from "./express/routes/main";
console = new ConsoleLogger();

const app = express();
app.disable("x-powered-by");
// app.set("trust proxy", true);
app.use(inputSanitizerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload(variables.fileUploadConfig));
app.use("/public", express.static("public"));
routes.use("/billing", billingRoutes);
app.use(checkSignature);
app.use(variables.parserMiddleware);
app.use("/api", deviceMiddleware, appRoutes);

redis
  .connect()
  .then(() => {
    console.log("Redis connected successfully!");
    app.listen(4500, "0.0.0.0", () => {
      console.log("App has been started on http://localhost:4500");
    });
  })
  .catch((err: any) => {
    console.error("Redis connection error:", err);
  });
