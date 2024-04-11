import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { multerOptions } from './options/multer.option';
import { UploadService } from './uploads.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }

  @ApiOperation({ summary: 'API Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    required: true,
    description: 'Upload file',
  })
  @Post('/multer')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', multerOptions.imageFilter))
  async multerUpload(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.multerUpload(file);
  }

}
