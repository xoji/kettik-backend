import { NextFunction, Request, Response } from "express";

async function rateLimiter(ip: string, limit: number, windowMs: number) {
  const key = `rate-limit:${ip}`;

  const current = await redis.incr(key);
  if (current === 1) {
    // Устанавливаем TTL при первом запросе
    await redis.expire(key, Math.floor(windowMs / 1000));
  }

  return current > limit;
}

export async function apiLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const windowMs = 24 * 60 * 60 * 1000; // 1 day

    if (!req.ip) {
      next();
      return;
    }

    const isOverLimit = await rateLimiter(
      `${req.ip}:${req.originalUrl}`,
      5,
      windowMs,
    );

    if (isOverLimit) {
      res.status(429).send("Too Many Requests");
      return;
    }

    next();
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: false,
      message: "Error in host! Please try again later!",
    });
  }
}
