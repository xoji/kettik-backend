import * as fs from "fs";
import { Console } from "console";
import { getRoot } from "./getRoot";
import path from "node:path";
import { ensureFileExists } from "./fileChecker";
import { formatter } from "./logger";

class Logger {
  private logStream: fs.WriteStream;
  private console: Console;

  constructor(
    logFilePath: string = path.resolve(getRoot(), "logs", "database.log"),
  ) {
    ensureFileExists(logFilePath);
    // Создаем поток для записи в файл
    this.logStream = fs.createWriteStream(logFilePath, { flags: "a" });
    // Создаем экземпляр Console, который выводит и в файл, и в консоль
    this.console = new Console({
      stdout: process.stdout,
      stderr: process.stderr,
    });
  }

  log(message: string) {
    const date = new Date();
    const logMessage = `[${formatter.format(date)}][${process.pid}] ${message}`;

    // Записываем в файл
    this.logStream.write(logMessage + "\n");
  }

  error(message: string) {
    const date = new Date();
    const logMessage = `[${formatter.format(date)}][${process.pid}] ERROR: ${message}`;

    this.logStream.write(logMessage + "\n");
  }

  // Не забываем закрывать поток при завершении
  close() {
    this.logStream.end();
  }
}

export const databaseLogger = new Logger();
