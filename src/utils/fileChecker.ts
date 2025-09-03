import * as fs from "fs";
import * as path from "path";

export function ensureFileExists(filePath: string) {
  const dir = path.dirname(filePath);

  try {
    // Проверяем, существует ли файл
    fs.accessSync(filePath);
  } catch {
    // Если файла нет, создаем папки и файл
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, "");
  }
}
