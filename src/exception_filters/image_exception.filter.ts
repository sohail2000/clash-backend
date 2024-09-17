import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ImageRequiredException } from 'src/custom.exception';

@Catch(ImageRequiredException)
export class ImageRequiredExceptionFilter implements ExceptionFilter {
  catch(exception: ImageRequiredException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    response
      .status(400)
      .json({
        message: 'validation-error',
        errors: {
          image: 'Image is required'
        }
      });
  }
}
