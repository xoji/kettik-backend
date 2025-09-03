import { Request, Response, NextFunction } from "express";
import { createHmac } from "node:crypto";

export function checkSignature(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    !req.headers["x-timestamp"] ||
    !req.headers["x-signature"] ||
    Array.isArray(req.headers["x-timestamp"]) ||
    Array.isArray(req.headers["x-signature"])
  ) {
    res.status(400).json({
      status: false,
      message: "Missing some headers",
    });
    return;
  }
  try {
    const parsed = parseInt(req.headers["x-timestamp"]!);
    if (Number.isNaN(parsed)) {
      res.status(400).json({
        status: false,
        message: "Wrong timestamp!",
      });
      return;
    }
    const compare = new Date().getTime() - parsed;
    if (compare > 20000 || compare < -20000) {
      res.status(400).json({
        status: false,
        message: "Request expired!",
      });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: false,
      message: "Wrong timestamp!",
    });
    return;
  }
  let data: { [key: string]: any } | undefined;
  if ((req.body && Object.keys(req.body).length) || req.files) {
    data = {};
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      if (req.body && Object.keys(req.body).length) {
        for (const key of Object.keys(req.body)) {
          data[key] = req.body[key];
        }
      }
      if (req.files) {
        for (const fileKey of Object.keys(req.files)) {
          const file = req.files[fileKey];
          if (Array.isArray(file)) {
            data[fileKey] = [];
            for (const f of file) {
              data[fileKey].push(f.name);
            }
          } else {
            data[fileKey] = file.name;
          }
        }
      }
    } else if (req.headers["content-type"] === "application/json") {
      data = req.body;
    }
  }
  let rawData: string = "";
  try {
    if (data) {
      rawData = JSON.stringify(data);
    }
  } catch (e) {
    console.error(e);
  }

  const hash = createHmac("sha256", "92c03229-125a-414a-b80d-f58d29abf249")
    .update(rawData + req.headers["x-timestamp"])
    .digest("hex");
  if (hash !== req.headers["x-signature"]) {
    res.status(403).json({
      status: false,
      message: "Invalid signature",
    });
    return;
  }
  next();
}
