import { Request, Response } from "express";

export class ListingController {
  async get(req: Request, res: Response) {
    try {
      database.ride.findMany({
        where: {
          AND: [
            {
              trips: {
                some: {
                  from: { city: "Tashkent" },
                },
              },
            },
            {
              trips: {
                some: {
                  to: { city: "Samarkand" },
                },
              },
            },
          ],
        },
        include: {
          trips: {
            orderBy: {
              index: "asc",
            },
          },
        },
      });
    } catch (e) {
      res.status(500).json({
        status: false,
        message: "Error in host! Please try again later!",
      });
      console.error(e);
    }
  }
}
