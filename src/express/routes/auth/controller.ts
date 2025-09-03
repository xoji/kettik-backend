import { Request, Response } from "express";
import { phoneNumber } from "../../../utils/phoneNumber";
import { deleteOtpRecords, generateOtpResObject } from "../../../utils/otp";
import jwt from "jsonwebtoken";
import { tokenChecker } from "../../../utils/token_checker";
import { ResendOtpTokenPayload } from "../../../types";
export interface OTPRecord {
  code: string;
  resend_time: number;
  token: string;
}

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      if (
        typeof phone !== "string" ||
        !phone.trim() ||
        !phone.replace(/\D/g, "")
      ) {
        res.status(400).json({
          status: false,
          message: "Phone number doesn't exist!",
        });
        return;
      }
      const pNumber = phoneNumber(phone);
      if (!pNumber) {
        res.status(422).json({
          status: false,
          message: "Wrong phone number!",
        });
        return;
      }
      if (pNumber.country !== "UZ") {
        res.status(400).json({
          status: false,
          message: "Sorry, but this region doesn't support right now!",
        });
        return;
      }
      let user = await database.users.findFirst({
        where: { phone_number: pNumber.phoneNumber },
      });
      if (!user) {
        user = await database.users.create({
          data: {
            phone_number: pNumber.phoneNumber,
          },
        });
        if (!user) {
          res.status(500).json({
            status: false,
            message: "Server Error",
          });
          return;
        }
        await database.wallet.create({
          data: {
            user_id: user.id,
          },
        });
      }
      const date = new Date();
      const otpHistory: OTPRecord | null = JSON.parse(
        await redis.get(`${pNumber.phoneNumber}:${req.device?.id}`),
      );
      if (otpHistory && otpHistory.resend_time <= date.getTime()) {
        res.status(422).json({
          status: false,
          message: "Please wait until you can resend the code.",
        });
        return;
      }
      await deleteOtpRecords(user.phone_number, req.device!.id);
      const generatedResponse = await generateOtpResObject(user, req.device!);

      res.status(200).json({
        status: true,
        data: generatedResponse,
        message: "Success!",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
    }
  }

  async submit(
    req: Request<any, any, { sms_token?: string; code?: string }>,
    res: Response,
  ) {
    try {
      let { sms_token, code } = req.body;
      if (!sms_token || !code) {
        res.status(400).json({
          status: false,
          message: "Bad request!",
        });
        return;
      }
      const payload = tokenChecker<{
        user_id: bigint;
        phone_number: string;
        expTime: number;
      }>(sms_token, process.env.AUTHORIZATION_OTP_SECRET_KEY!);
      if (!payload) {
        res.status(400).json({
          status: false,
          message: "Token is not valid!",
        });
        return;
      }
      const user = await database.users.findFirst({
        where: { id: payload.user_id },
      });
      if (!user) {
        console.log(`Suspicious request: ${req.device?.id},${req.ip}`);
        res.status(404).json({
          status: false,
          message: "User not found or request is invalid!",
        });
        return;
      }
      const data: OTPRecord | undefined | null = JSON.parse(
        await redis.get(`${user.phone_number}:${req.device?.id}`),
      );
      if (!data) {
        res.status(400).json({
          status: false,
          message: "Code has expired or wrong request!",
        });
        return;
      }
      if (sms_token !== data.token) {
        res.status(400).json({
          status: false,
          message: "Token is not valid!",
        });
        return;
      }
      if (code !== data.code) {
        res.status(400).json({
          status: false,
          message: "Code is not valid!",
        });
        return;
      }
      await redis.del(`${user.phone_number}:${req.device?.id}`);
      const pNumber = phoneNumber(user.phone_number)!;
      const token = jwt.sign(
        {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: pNumber.maskedPhoneNumber,
          gender: user.gender,
          photo: user.photo,
          rating: user.rating,
          device: req.device?.id,
          user_verified: user.user_verification,
          driver_verified: user.driver_verification,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        process.env.AUTHORIZATION_SECRET_KEY!,
      );
      await database.devices.updateMany({
        data: {
          user_id: null,
          access_token: null,
        },
        where: { user_id: user.id },
      });
      await database.devices.update({
        data: {
          user_id: user.id,
          access_token: token,
        },
        where: { id: req.device!.id },
      });
      req.device!.user_id = user.id;
      req.device!.access_token = token;
      await redis.set(`device:${req.device?.id}`, JSON.stringify(req.device), {
        expiration: {
          type: "EX",
          value: 86400,
        },
      });
      res.status(200).json({
        status: true,
        message: "Success!",
        data: {
          authorization_token: token,
          token_type: "Bearer",
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: pNumber.maskedPhoneNumber,
            gender: user.gender,
            photo: user.photo,
            rating: user.rating,
            user_verified: user.user_verification,
            driver_verified: user.driver_verification,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
    }
  }

  async resend(
    req: Request<any, any, { resend_token?: string }>,
    res: Response,
  ) {
    try {
      const { resend_token } = req.body;
      if (!resend_token) {
        res.status(400).json({
          status: false,
          message: "Invalid request!",
        });
        return;
      }
      const checked = tokenChecker<{
        user_id: number;
        phone_number: string;
        sms_token: string;
        expTime: number;
        start_time: number;
      }>(resend_token, process.env.AUTHORIZATION_OTP_RESEND_SECRET_KEY!);
      if (!checked) {
        res.status(400).json({
          status: false,
          message: "Invalid token!",
        });
        return;
      }
      const date = new Date();
      if (checked.start_time > date.getTime()) {
        res.status(400).json({
          status: false,
          message: "The token has not yet started to operate.",
        });
        return;
      }
      const user = await database.users.findFirst({
        where: { id: checked.user_id },
      });
      if (!user) {
        res.status(400).json({
          status: false,
          message: "Invalid token!",
        });
        return;
      }
      let dbData: string | undefined | null;
      try {
        dbData = await redis.get(
          `${user.phone_number}:${req.device?.id}:resend`,
        );
      } catch (e) {
        console.error(e);
      }
      if (!dbData) {
        res.status(400).json({
          status: false,
          message: "Wrong request!",
        });
        return;
      }
      const verified = tokenChecker<ResendOtpTokenPayload>(
        dbData,
        process.env.AUTHORIZATION_OTP_RESEND_SECRET_KEY!,
      );
      if (!verified) {
        res.status(400).json({
          status: false,
          message: "Wrong resend token!",
        });
        return;
      }
      await deleteOtpRecords(user.phone_number, req.device!.id);
      const generatedResponse = await generateOtpResObject(user, req.device!);

      res.status(200).json({
        status: true,
        data: generatedResponse,
        message: "Success!",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
    }
  }

  async signOut(req: Request, res: Response) {
    try {
      if (!req.user || !req.device) {
        res.status(400).json({
          status: false,
          message: "Invalid request!",
        });
        return;
      }
      const device = await database.devices.update({
        where: {
          id: req.device.id,
        },
        data: {
          user_id: null,
          access_token: null,
        },
      });
      if (!device) {
        res.status(404).json({
          status: false,
          message: "Device not found!",
        });
        return;
      }
      await redis.set(`device:${device.id}`, JSON.stringify(device), {
        expiration: {
          type: "EX",
          value: 86400,
        },
      });
      req.device = device;
      res.status(200).json({
        status: true,
        message: "Success!",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
    }
  }
}
