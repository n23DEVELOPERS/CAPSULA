import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { join } from 'path';
import { config } from 'src/config';
import fs from 'fs';

@Injectable()
export class FileService {
  private filePath = join(process.cwd(), '..', config.FILE_PATH);

  async create(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.originalname}`;
      if (!existsSync(this.filePath))
        mkdirSync(this.filePath, { recursive: true });

      if (file.buffer) {
        await new Promise<void>((res, rej) => {
          writeFile(join(this.filePath, fileName), file.buffer, (err: any) => {
            if (err) rej(err);
            res();
          });
        });
      } else if (file.path) {
        const oldPath = file.path;
        const newPath = join(this.filePath, fileName);
        await fs.promises.rename(oldPath, newPath);
      } else {
        throw new Error('File does not contain buffer or path');
      }

      return `${config.BASE_URL}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on uploading file: ${error}`,
      );
    }
  }

  async createMany(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.create(file)));
  }

  async delete(fileName: string): Promise<void> {
    try {
      const file = fileName.split(`${config.BASE_URL}/`)[1];
      const fileUrl = join(this.filePath, file);
      if (!existsSync(fileUrl)) throw new NotFoundException('File not found');

      await new Promise<void>((res, rej) => {
        unlink(fileUrl, (err: any) => {
          if (err) rej(err);
          res();
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on deleting file: ${error}`,
      );
    }
  }

  async exists(fileName: string): Promise<boolean> {
    try {
      const file = fileName.split(`${config.BASE_URL}/`)[1];
      const fileUrl = join(this.filePath, file);
      if (existsSync(fileUrl)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on checking file: ${error}`,
      );
    }
  }
}
