import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { randomBytes } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Function to generate a random alphanumeric string
const generateRandomString = (length: number) => {
   return randomBytes(length).toString('hex').slice(0, length);
};

// Multer configuration
export const multerConfig = {
   // dest: process.env.UPLOAD_LOCATION,
   dest: './uploads'
};


// Multer upload options
export const multerOptions: MulterOptions = {
   // Enable file size limits
   limits: {
      //  fileSize: +process.env.MAX_FILE_SIZE,
      fileSize:  6 * 1024 * 1024
   },
   // Check the mimetypes to allow for upload
   fileFilter: (req: any, file: any, cb: any) => {
       if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
           // Allow storage of file
           cb(null, true);
       } else {
           // Reject file
           cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
       }
   },
   // Storage properties
   storage: diskStorage({
       // Destination storage path details
       destination: (req: any, file: any, cb: any) => {
           const uploadPath = multerConfig.dest;
           // Create folder if doesn't exist
           if (!existsSync(uploadPath)) {
               mkdirSync(uploadPath);
           }
           cb(null, uploadPath);
       },
       // File modification details
       filename: (req: any, file: any, cb: any) => {
           // Calling the callback passing the random name generated with the original extension name
         //   cb(null, `${uuid()}${extname(file.originalname)}`);
           cb(null, `${generateRandomString(20)}${extname(file.originalname)}`);
       },
   }),
};