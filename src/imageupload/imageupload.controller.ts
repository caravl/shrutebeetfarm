import { Controller, Post, Req, Res } from '@nestjs/common';
import { ImageUploadService } from './imageupload.service';

@Controller('imageupload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post()
  async create(@Req() request, @Res() response) {
    try {
      await this.imageUploadService.imageupload(request, response)
    } catch (error) {
      return response
      .status(500)
      .json(`Failed to upload image: ${error.message}`);
    }
  }
}
