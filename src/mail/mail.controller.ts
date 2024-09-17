import { Controller, Get, Res, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from './mail.service';
import * as fs from "fs";
import { join } from "path";
import { SendEmail } from './dto/send-email.interface';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('/test')
  async sendMailer(@Body() dto : SendEmail) {
    const mail = await this.mailService.sendWelcomeEmail(dto);
    return {"message" : "semdMailer"}
  }
}
