import path from "node:path";
import { getRoot } from "./utils/getRoot";
import { parseObject } from "./utils/parser";
import { Request, Response, NextFunction } from "express";

export const variables = {
  fileUploadConfig: {
    useTempFiles: true,
    tempFileDir: path.resolve(getRoot(), "assets", "temp"),
    createParentPath: true,
    parseNested: true,
    // debug: true,
    // logger: {
    //   log: (...logs: any[]) => {
    //     console.log(logs);
    //   },
    // },
  },
  parserMiddleware: (req: Request, _: Response, next: NextFunction) => {
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      req.body = parseObject(req.body);
    }
    next();
  },
};
