import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { getRoot } from "../utils/getRoot";

export async function fileUpload(
  file: UploadedFile,
  filename: string,
  dirName: string,
) {
  try {
    const dirPath = path.resolve(getRoot(), "public", dirName);
    try {
      fs.accessSync(dirPath);
    } catch {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    await file.mv(path.join(dirPath, filename));
    return `/public/${dirName}/${filename}`;
  } catch (e) {
    return null;
  }
}
