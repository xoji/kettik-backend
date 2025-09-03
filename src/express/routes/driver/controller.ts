import { Request, Response } from "express";
import { imageChecker } from "../../../utils/imageChecker";
import { UploadedFile } from "express-fileupload";
interface DriverCreateRequest {
  driver_licence_series?: string;
  driver_licence_number?: string;
  exp_date?: number;
  vehicle_licence_series?: string;
  vehicle_licence_number?: string;
  car_brand?: string;
  car_model?: string;
  color?: string;
  car_year?: number;
  car_plate?: string;
  car_VIN?: string;
}

export class DriverController {
  async create(req: Request<any, any, DriverCreateRequest>, res: Response) {
    try {
      const {
        driver_licence_series,
        driver_licence_number,
        exp_date,
        vehicle_licence_series,
        vehicle_licence_number,
        car_brand,
        car_model,
        color,
        car_year,
        car_plate,
        car_VIN,
      } = req.body;

      if (
        !driver_licence_series ||
        !driver_licence_number ||
        !exp_date ||
        !vehicle_licence_series ||
        !vehicle_licence_number ||
        !car_brand ||
        !car_model ||
        !color ||
        !car_year ||
        !car_plate ||
        !car_VIN
      ) {
        res.status(400).json({
          status: false,
          message: "No required data!",
        });
        return;
      }
      if (!req.files) {
        res.status(400).json({
          status: false,
          message: "No files found.",
        });
        return;
      }
      const images = [
        {
          name: "front side of vehicle licence",
          image: req.files.vehicle_licence_front,
        },
        {
          name: "back side of vehicle licence",
          image: req.files.vehicle_licence_back,
        },
        {
          name: "front side of driver licence",
          image: req.files.driver_licence_front,
        },
        {
          name: "back side of driver licence",
          image: req.files.driver_licence_back,
        },
        {
          name: "front side of vehicle",
          image: req.files.car_front,
        },
        {
          name: "back side of vehicle",
          image: req.files.car_back,
        },
        {
          name: "left side of vehicle",
          image: req.files.car_left,
        },
        {
          name: "right side of vehicle",
          image: req.files.car_right,
        },
      ];
      const errors = [];
      for (const img of images) {
        if (!img.image) {
          errors.push(`${img.name} is not found`);
        }
        if (img.image && Array.isArray(img.image)) {
          errors.push(`type of ${img.name} is not a file`);
        }
        if (img.image && !imageChecker((img.image as UploadedFile).name)) {
          errors.push(`${img.name} is not a valid image`);
        }
      }
      if (errors.length) {
        res.status(400).json({
          status: false,
          message: `Files not validated!\nwhat's wrong: ${errors.join(",")}`,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
    }
  }
}
