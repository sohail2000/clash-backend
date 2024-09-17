import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmail } from './dto/send-email.interface';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('emailSending') private readonly emailQueue: Queue
  ) { }
  async sendWelcomeEmail(data: SendEmail) {
    try {
      const job = await this.emailQueue.add('welcome', data); 
      console.log("job-added to emailSending-queue", job);
    } catch (error) {
      console.log("error adding job to emailSending-queue", error);
    }
  }
}
