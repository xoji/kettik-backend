import { Request, Response } from "express";
import axios from "axios";
import { getMyIdToken } from "../../../services/my_id";
import { MyIDCredentials } from "../../../types";
import jwt from "jsonwebtoken";
import { phoneNumber } from "../../../utils/phoneNumber";
import { fileUpload } from "../../../services/upload_image";
import path from "node:path";
import { Gender } from "../../../generated/prisma";

export class UserController {
  async identification(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(400).json({
          status: false,
          message: "User not found!",
        });
        return;
      }
      if (req.user.user_verification) {
        res.status(400).json({
          status: false,
          message: "User already verified!",
        });
        return;
      }
      let myIdToken = await getMyIdToken();
      if (!myIdToken) {
        res.status(500).json({
          status: false,
          message: "Server can't connect to Identification server!",
        });
        return;
      }
      const sessionRes = await axios.post<{ session_id: string }>(
        `${process.env.MY_ID_ENDPOINT}/api/v1/sdk/sessions`,
        {},
        {
          headers: {
            Authorization: `Bearer ${myIdToken}`,
          },
          validateStatus: (_) => {
            return true;
          },
        },
      );
      console.log(
        `${process.env.MY_ID_ENDPOINT}/api/v1/sdk/sessions`,
        sessionRes.status,
        sessionRes.data,
      );
      if (sessionRes.status !== 200 || !sessionRes.data.session_id) {
        res.status(500).json({
          status: false,
          message: "Server can't connect to Identification server!",
        });
        return;
      }
      res.status(200).json({
        status: true,
        data: {
          session_id: sessionRes.data.session_id,
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

  async completeIdentification(req: Request, res: Response) {
    try {
      const { code } = req.body;
      if (!req.files || !req.files.image || Array.isArray(req.files.image)) {
        res.status(400).json({
          status: false,
          message: "Identification image is required!",
        });
        return;
      }
      if (!code) {
        res.status(400).json({
          status: false,
          message: "Code is required!",
        });
        return;
      }
      if (!req.user) {
        res.status(400).json({
          status: false,
          message: "User not found!",
        });
        return;
      }
      if (req.user.user_verification) {
        res.status(400).json({
          status: false,
          message: "User already verified!",
        });
        return;
      }
      const token = await getMyIdToken();
      if (!token) {
        res.status(500).json({
          status: false,
          message: "Server can't connect to Identification server!",
        });
        return;
      }
      const idRes = await axios.get<MyIDCredentials>(
        `${process.env.MY_ID_ENDPOINT}/api/v1/sdk/data?code=${code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (_) => {
            return true;
          },
        },
      );
      console.log(
        `${process.env.MY_ID_ENDPOINT}/api/v1/sdk/data?code=${code}`,
        idRes.status,
      );
      if (idRes.status !== 200 || !idRes.data) {
        res.status(500).json({
          status: false,
          message: "Server can't connect to Identification server!",
        });
        return;
      }
      const filepath = await fileUpload(
        req.files.image,
        `${idRes.data.data.profile.common_data.first_name}-${new Date().getTime()}${path.extname(req.files.image.name)}`,
        "user_verification",
      );
      if (!filepath) {
        res.status(500).json({
          status: false,
          message: "Error when save image!",
        });
        return;
      }
      const user = await database.users.update({
        data: {
          first_name: idRes.data.data.profile.common_data.first_name,
          last_name: idRes.data.data.profile.common_data.last_name,
          gender:
            idRes.data.data.profile.common_data.gender === "1"
              ? Gender.male
              : Gender.female,
          my_id_photo: filepath,
          pinfl: idRes.data.data.profile.common_data.pinfl,
          birth: new Date(
            idRes.data.data.profile.common_data.birth_date,
          ).getTime(),
          nationality: idRes.data.data.profile.common_data.nationality,
          passport_series: idRes.data.data.profile.doc_data.pass_data.replace(
            /[^A-Z,a-z]/g,
            "",
          ),
          passport_number: parseInt(
            idRes.data.data.profile.doc_data.pass_data.replace(/[^0-9]/g, ""),
          ),
          passport_exp: new Date(
            idRes.data.data.profile.doc_data.expiry_date,
          ).getTime(),
          user_verification: true,
          verifiedAt: new Date(),
        },
        where: {
          id: req.user.id,
        },
      });
      await redis.set(`user:${req.user.id}`, JSON.stringify(user), {
        expiration: {
          type: "EX",
          value: 24 * 60 * 60 * 7,
        },
      });
      const pNumber = phoneNumber(user.phone_number)!;
      const signToken = jwt.sign(
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
      const device = await database.devices.update({
        data: {
          access_token: signToken,
        },
        where: {
          id: req.device?.id,
        },
      });
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
        data: {
          authorization_token: signToken,
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

  async changeProfileImage(req: Request, res: Response) {
    try {
      if (!req.files || !req.files.image || Array.isArray(req.files.image)) {
        res.status(400).json({
          status: false,
          message: "Image is required!",
        });
        return;
      }
      if (!req.user) {
        res.status(400).json({
          status: false,
          message: "User not found!",
        });
        return;
      }
      const filePath = await fileUpload(
        req.files.image,
        `${new Date().getTime()}${path.extname(req.files.image.name)}`,
        "profile",
      );
      if (!filePath) {
        res.status(500).json({
          status: false,
          message: "Error when uploading image!",
        });
        return;
      }
      const user = await database.users.update({
        data: {
          photo: filePath,
        },
        where: {
          id: req.user.id,
        },
      });
      const pNumber = phoneNumber(user.phone_number)!;
      const signToken = jwt.sign(
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
      const device = await database.devices.update({
        data: {
          access_token: signToken,
        },
        where: {
          id: req.device?.id,
        },
      });
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
        data: {
          authorization_token: signToken,
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
}
