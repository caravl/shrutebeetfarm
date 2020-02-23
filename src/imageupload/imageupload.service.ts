import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

@Injectable()
export class ImageUploadService {
  constructor() {}

  async imageupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log('error: ', error);
          return res.status(404).json(`Failed to upload image: ${error}`);
        }
        return res.status(201).json(`Image saved: ${req.files[0].location}`);
      })
    } catch (error) {
      console.log('error: ', error);
      return res.status(500).json(`Failed to upload image: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
  // upload is the name of field to send the file
  // 1 is the number of files to upload

}
