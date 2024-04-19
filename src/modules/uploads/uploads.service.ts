import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import {
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_URL_ENDPOINT
} from 'src/constants';
import { ICommonUploadFile } from 'src/interfaces';

@Injectable()
export class UploadService {
  private imageKit: ImageKit
  constructor() {
    this.imageKit = new ImageKit({
      privateKey: IMAGEKIT_PRIVATE_KEY,
      publicKey: IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT
    })
  }

  async multerUpload(file: Express.Multer.File): Promise<ICommonUploadFile> {
    const result = await this.imageKit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    
    return {
      title: file.originalname,
      url: result.url
    };
  }
}