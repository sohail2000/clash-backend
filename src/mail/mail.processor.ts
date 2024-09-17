import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { SendEmail } from "./dto/send-email.interface";
import { MailerService } from "@nestjs-modules/mailer";
import e from "express";

@Processor('emailSending')
export class MailProcessor {
    constructor(private readonly mailerService: MailerService) { }


    @Process('welcome')
    async sendWelcomeEmail(job: Job<SendEmail>) {
        console.log("sendWelcomeEmail -FIRED")
        try {
            const { data } = job;
            const { to, subject, ...res } = data
            const mailres =  await this.mailerService.sendMail({
                to: {address: "stnhtlgth@emlhub.com",name: "Md Sohail"},
                from: '"Clash Team" <7c1f63001@smtp-brevo.com>', 
                subject: "subject",
                template: './welcome', // `.ejs` extension is appended automatically
                context: { // filling <%= %> brackets with content
                    // ...res
                    name : "test-user"
                },
            })
            console.log("mail-res", mailres);
        } catch (error) {
            console.log("sendWelcomeEmail-ERROR", error)
        }

    }

    // @Process('email-verify')
    // async sendWelcomeEmail(job: Job<SendEmail>) {
    //     const { data } = job;

    //     const confirmation_url = `example.com/auth/confirm?token=123`;

    //     await this.mailService.sendMail({
    //         to: data.to ,
    //         // from: '"Support Team" <support@example.com>', // override default from
    //         subject: data.subject,
    //         template: './welcome', // `.ejs` extension is appended automatically
    //         context: { // filling <%= %> brackets with content
    //           name: "Mphd Sohail",
    //           confirmation_url,
    //         },
    //     })

    // }

    // @Process('reset-password')
    // async sendResetPasswordEmail(job: Job<SendEmail>) {
    //     const { data } = job;

    //     // send the reset password email here
    // }
}