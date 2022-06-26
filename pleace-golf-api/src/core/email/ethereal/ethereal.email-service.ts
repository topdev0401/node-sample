/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as nodemailer from "nodemailer";

import config from '../../../config';
import { Logger } from "../../logging";
import { EmailService } from "../email-service";
import { EmailAddress } from "../email-address";
import { IEmailTemplate, EmailTemplateType } from "../email-template.interface";

export class EtherealEmailService extends EmailService {

    constructor(protected from: EmailAddress, protected replyTo: EmailAddress) {
        super(
            from, replyTo
        );
    }

    async sendMail(emailTemplate: IEmailTemplate): Promise<void> {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });

        const info = await transporter.sendMail({
            from: this.formatEmailAsNameAndAddress(this.from), // sender address
            to: emailTemplate.to.email, // list of receivers
            subject: emailTemplate.subject, // Subject line
            text: emailTemplate.getText(), // plain text body
            html: emailTemplate.getHtml() // html body
        });

        console.log("Message sent: %s", info.messageId);

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}
