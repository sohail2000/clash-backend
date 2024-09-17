import {
  Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
  Put,
  ParseIntPipe,
  UploadedFiles,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { ClashService } from './clash.service';
import { CreateClashDto } from './dto/create-clash.dto';
import { UpdateClashDto } from './dto/update-clash.dto';
import { Express } from 'express'

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { calculateObjectSize } from 'typeorm/driver/mongodb/bson.typings';

import { Request } from 'express';
import { JwtGuard } from './clash-jwt.guard';
import { ImageRequiredExceptionFilter } from 'src/exception_filters/image_exception.filter';
import { ImageRequiredException } from 'src/custom.exception';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 20 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];


@Controller('clash')
export class ClashController {
  constructor(private readonly clashService: ClashService) { }

  @Get()
  @UseGuards(JwtGuard)
  async getAllClashes(@Req() res: Request) {
    if (!res.user.id) {
      throw new UnauthorizedException("Invalid user-id");
    }
    console.log("get-all-clash-userId", res.user);
    const clashes =  this.clashService.getAllClashes(res.user.id);
    // return { message : "Data Fetched", data: clashes}
    return clashes;
  }

  @Get(':id')
  async getClashById(@Param('id', ParseIntPipe) id: number) {
    const clash = await this.clashService.clashById(id);
    return clash;
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateClash(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClashDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const clash = await this.clashService.updateClash(id, image?.filename, body)
    return { message: "Clash updated successfully" };
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseFilters(ImageRequiredExceptionFilter)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async createClash(
    @Body() createClashDto: CreateClashDto,
    @UploadedFile()
    image: Express.Multer.File,
    @Req() req: Request
  ) {
    console.log("user in create-clash req", req.user)
    if (!image) {
      throw new ImageRequiredException();
    }
    createClashDto.image = image.filename;
    console.log("user", req.user)
    if (!req?.user.id) {
      throw new UnauthorizedException("Invalid user-id");
    }
    await this.clashService.createClash(req.user.id, createClashDto);
    return { message: "Clashed created successfully" };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteClash(@Param('id', ParseIntPipe) id: number) {
    await this.clashService.deleteClash(id);
    return { message: "Clash deleted successfully" };
  }

  @Post('/items')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('images[]', 2, multerOptions))
  async additems(
    @Body() { id }: { id: number },
    @UploadedFiles()
    images: Express.Multer.File[]
  ) {
    if (!images) {
      throw new BadRequestException("Images are required");
    }
    const imgFilenames = images.map((img) => img.filename);
    await this.clashService.createClashItems(imgFilenames, id);

    return { message: "Clash items updated successfully" };
  }












}
