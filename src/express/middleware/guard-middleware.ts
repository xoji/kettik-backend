import { Request, Response, NextFunction } from "express";

function sanitize(obj: any) {
  if (typeof obj === "string") {
    return obj
      .replace(/['";]/g, "")
      .replace(/--/g, "")
      .replace(/\/\*/g, "")
      .replace(/\*\//g, "");
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;
}

/**
 * Middleware для минимальной фильтрации входных данных от потенциальных
 * попыток Code Injection или SQL Injection.
 */
export function inputSanitizerMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  // Рекурсивно обрабатывает все значения в теле запроса, query и params

  req.body = sanitize(req.body);
  if (req.query) {
    for (const key in req.query) {
      const value = req.query[key];
      if (typeof value === "string") {
        req.query[key] = sanitize(value);
      } else if (Array.isArray(value)) {
        req.query[key] = value.map(sanitize);
      }
    }
  }
  if (req.params) {
    for (const key in req.params) {
      req.params[key] = sanitize(req.params[key]);
    }
  }
  next();
}
