import { BadRequestException } from '@nestjs/common';

export class ImageRequiredException extends BadRequestException {
  constructor() {
    super('Image is required');
  }
}
