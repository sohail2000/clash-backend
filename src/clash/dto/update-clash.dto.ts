import { PartialType } from '@nestjs/mapped-types';
import { CreateClashDto } from './create-clash.dto';

export class UpdateClashDto extends PartialType(CreateClashDto) {}
