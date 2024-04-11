import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  imageFilter: {
    limits: {
      files: 1,
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req: Request, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
    },
  },
};
