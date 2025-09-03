import { Request, Response, NextFunction } from "express";
import { tokenChecker } from "../../utils/token_checker";
import { UserTokenPayload } from "../../types";
import { getUser } from "../../utils/getUser";

export function userGuardMiddleware(userRequired: boolean) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        if (userRequired) {
          res.status(403).json({
            status: false,
            message: "Authorization required!",
          });
          return;
        }
        next();
        return;
      }
      const split = authorization.trim().split(" ");
      if (split.length !== 2 || split[0] !== "Bearer") {
        if (userRequired) {
          res.status(403).json({
            status: false,
            message: "Authorization required!",
          });
          return;
        }
        next();
        return;
      }
      const token = split[1];
      const decoded = tokenChecker<UserTokenPayload>(
        token,
        process.env.AUTHORIZATION_SECRET_KEY!,
      );
      if (!decoded) {
        if (userRequired) {
          res.status(401).json({
            status: false,
            message: "User token is invalid!",
          });
          return;
        }
        next();
        return;
      }
      const user = await getUser(decoded.id);
      if (!user) {
        if (userRequired) {
          res.status(401).json({
            status: false,
            message: "User not found!",
          });
          return;
        }
        next();
        return;
      }
      if (
        !req.device?.user_id ||
        Number(req.device.user_id) !== Number(user.id) ||
        decoded.device !== req.device.id ||
        req.device?.access_token !== token
      ) {
        if (userRequired) {
          res.status(401).json({
            status: false,
            message: "Authorization failed! Please contact administrator!",
          });
          return;
        }
        next();
        return;
      }
      req.user = user;
      next();
    } catch (e) {
      console.error(e);
      if (userRequired) {
        res.status(403).json({
          status: false,
          message: "User authorization failed!",
        });
        return;
      }
      next();
    }
  };
}
