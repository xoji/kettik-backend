import { Request, Response } from "express";

export interface CreateDeviceBody {
  brand?: string;
  model?: string;
  os?: string;
  version?: string;
  user_id?: number;
  app_version?: string;
  fcm?: string;
}

export interface UpdateDeviceBody {
  brand?: string;
  model?: string;
  os?: string;
  version?: string;
  app_version?: string;
  language?: string;
  fcm?: string;
}

export class DeviceRouteController {
  async create(
    req: Request<any, any, CreateDeviceBody | undefined | null>,
    res: Response,
  ) {
    try {
      if (!req.body) {
        res.status(400).json({
          status: false,
          message: "Missing required fields",
        });
        return;
      }
      const { brand, model, os, version, user_id, app_version, fcm } = req.body;
      if (!brand || !model || !os || !version || !app_version) {
        res.status(400).json({
          status: false,
          message: "Invalid request",
        });
        return;
      }
      if (
        !brand.trim() ||
        !model.trim() ||
        !os.trim() ||
        !version.trim() ||
        !app_version.trim()
      ) {
        res.status(400).json({
          status: false,
          message: "Invalid request",
        });
        return;
      }
      const created = await database.devices.create({
        data: {
          brand,
          model,
          OS: os,
          version,
          app_version,
          user_id,
          fcm_token: fcm ?? null,
        },
        select: {
          id: true,
          brand: true,
          model: true,
          OS: true,
          version: true,
          app_version: true,
        },
      });
      res.status(200).json({
        status: true,
        message: "Device created",
        data: created,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
    }
  }

  async update(req: Request<any, any, UpdateDeviceBody>, res: Response) {
    try {
      const { brand, model, os, version, app_version, language, fcm } =
        req.body;
      if (
        language &&
        language !== "uz" &&
        language !== "en" &&
        language !== "ru"
      ) {
        res.status(400).json({
          status: false,
          message: "Invalid language!",
        });
        return;
      }
      const dataToUpdate = {
        brand:
          brand && brand.toLowerCase() !== req.device?.brand.toLowerCase()
            ? brand
            : undefined,
        model:
          model && model.toLowerCase() !== req.device?.model.toLowerCase()
            ? model
            : undefined,
        OS:
          os && os.toLowerCase() !== req.device?.OS.toLowerCase()
            ? os
            : undefined,
        version:
          version && version.toLowerCase() !== req.device?.version.toLowerCase()
            ? version
            : undefined,
        app_version:
          app_version &&
          app_version.toLowerCase() !== req.device?.app_version.toLowerCase()
            ? app_version
            : undefined,
        language:
          language && language !== req.device?.language ? language : undefined,
        fcm: fcm && fcm !== req.device?.fcm_token ? fcm : undefined,
      };
      if (
        !dataToUpdate.brand &&
        !dataToUpdate.model &&
        !dataToUpdate.OS &&
        !dataToUpdate.version &&
        !dataToUpdate.app_version &&
        !dataToUpdate.language &&
        !dataToUpdate.fcm
      ) {
        res.status(400).json({
          status: false,
          message:
            "Invalid request, request contains no update or request doesn't contains any fields!",
        });
        return;
      }
      const updated = await database.devices.update({
        where: { id: req.device?.id },
        data: {
          brand: dataToUpdate.brand ?? req.device?.brand,
          model: dataToUpdate.model ?? req.device?.model,
          OS: dataToUpdate.OS ?? req.device?.OS,
          version: dataToUpdate.version ?? req.device?.version,
          app_version: dataToUpdate.app_version ?? req.device?.app_version,
          language: dataToUpdate.language ?? req.device!.language,
          fcm_token: dataToUpdate.fcm ?? req.device!.fcm_token,
        },
        select: {
          id: true,
          brand: true,
          model: true,
          OS: true,
          version: true,
          app_version: true,
          language: true,
          fcm_token: false,
          createdAt: true,
          updatedAt: true,
        },
      });
      await redis.set(`device:${updated.id}`, JSON.stringify(updated), {
        expiration: {
          type: "EX",
          value: 86400,
        },
      });
      res.status(200).json({
        status: true,
        data: updated,
        message: "Device updated successfully!",
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
