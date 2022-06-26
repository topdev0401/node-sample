/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as nodemailer from "nodemailer";

import config from '../../../config';
import { Logger } from "../../logging";
import { EmailService } from "../email-service";
import { EmailAddress } from "../email-address";
import { IEmailTemplate, EmailTemplateType } from "../email-template.interface";

export class GmailEmailService extends EmailService {

    constructor(protected from: EmailAddress, protected replyTo: EmailAddress) {
        super(
            from, replyTo
        );
    }

    async sendMail(emailTemplate: IEmailTemplate): Promise<void> {

        const testAccount = {
            user: "codevtest7@gmail.com",
            password: "--"
        };

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            //port: 587,
            //secure: false, // upgrade later with STARTTLS
            port: 465,
            secure: true, // use TLS
            auth: {
                user: testAccount.user,
                pass: testAccount.password
            }
        });

        const info = await transporter.sendMail({
            from: this.from.email, // sender address
            to: emailTemplate.to.email, // list of receivers
            subject: emailTemplate.subject, // Subject line
            text: emailTemplate.getText(), // plain text body
            html: emailTemplate.getHtml() // html body
        });

        Logger.info("Message sent: %s", info.messageId);

    }
}
