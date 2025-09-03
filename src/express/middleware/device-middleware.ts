import { NextFunction, Request, Response } from "express";
import { RequestDevice } from "../../types";

export async function deviceMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers["x-app-device"];
    if (!header || Array.isArray(header) || !header.trim()) {
      next();
      return;
    }
    let device: RequestDevice | null | string = await redis.get(
      `device:${header}`,
    );
    if (!device) {
      device = await database.devices.findFirst({
        where: {
          id: header,
        },
      });
      if (!device) {
        next();
        return;
      }
      await redis.set(`device:${header}`, JSON.stringify(device), {
        expiration: {
          type: "EX",
          value: 86400,
        },
      });
    } else {
      device = JSON.parse(device as string);
    }
    req.device = device as RequestDevice;
    next();
  } catch (e) {
    console.error(e);
    next();
  }
}

export async function deviceGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.device) {
    res.status(403).json({
      status: false,
      message: "Device authentication failed",
    });
    return;
  }
  next();
}
