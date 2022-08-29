import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as dotenv from 'dotenv';
import { v4 } from 'uuid';

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});

export const tagsMulterOption = {
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, `tags/${v4()}_${file.originalname}`);
    },
  }),
};

export const postsMulterOption = {
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, `posts/${v4()}_${file.originalname}`);
    },
  }),
};

export const userMulterOption = {
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, `users/${v4()}_${file.originalname}`);
    },
  }),
};

// const FilesInterceptor = [
//   {
//     fieldname: 'images',
//     originalname: 'test.jpeg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     buffer: 'buffer data',
//     size: 43091,
//     key: 'clothes/Date.now()_originalname',
//     localtion: 's3 address',
//   },
// ];

// const metaDataFile = {
//   filedname: 'images',
//   originalname: 'test.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg'
// }
