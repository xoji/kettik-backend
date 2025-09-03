import * as fs from "fs";
import { Console } from "console";
import { getRoot } from "./getRoot";
import path from "node:path";
import { ensureFileExists } from "./fileChecker";
import * as util from "node:util";

export const formatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Tashkent", // ваш часовой пояс
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export class ConsoleLogger extends Console {
  private logStream: fs.WriteStream;
  private errorStream: fs.WriteStream;
  constructor() {
    super(process.stdout, process.stderr);
    ensureFileExists(path.resolve(getRoot(), "logs", "app.log"));
    ensureFileExists(path.resolve(getRoot(), "logs", "error.log"));
    this.logStream = fs.createWriteStream(
      path.resolve(getRoot(), "logs", "app.log"),
      { flags: "a" },
    );
    this.errorStream = fs.createWriteStream(
      path.resolve(getRoot(), "logs", "error.log"),
      { flags: "a" },
    );
  }
  log(...args: any[]) {
    const message = util.format(...args);
    const date = new Date();
    const err = {} as Error;
    Error.captureStackTrace(err, this.trace);
    const stackTrace = err.stack
      ? ["System Log", ...err.stack!.split("\n").slice(2)].join("\n").trim()
      : "";
    const logMessage = `[${formatter.format(date)}][${process.pid}] ${message}\n ${stackTrace}\n${"\u2014".repeat(100)}`;
    // Записываем в файл
    this.logStream.write(logMessage + "\n");
    process.stdout.write(`[${process.pid}] ${message + "\n"}`);
  }

  error(...args: any[]) {
    const message = util.format(...args);
    const date = new Date();
    const errorMessage = `[${formatter.format(date)}][${process.pid}] ${message}\n${"\u2014".repeat(100)}`;

    // Записываем в файл
    this.errorStream.write(errorMessage + "\n");
    process.stderr.write(`[${process.pid}] ${message + "\n"}`);
  }
}
