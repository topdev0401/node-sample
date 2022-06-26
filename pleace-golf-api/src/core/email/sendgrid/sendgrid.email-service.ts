/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as sendgridMailer from "@sendgrid/mail";
import { Logger } from "../../logging";
import { EmailService } from "../email-service";
import { EmailAddress } from "../email-address";
import { IEmailTemplate, EmailTemplateType } from "../email-template.interface";
import { EmailData } from "./sendgrid-email-data";

export class SendgridEmailService extends EmailService {

    constructor(protected sendgridApiKey: string, protected from: EmailAddress, protected replyTo: EmailAddress) {
        super(
            from, replyTo
        );

        sendgridMailer.setApiKey(sendgridApiKey);
    }

    async sendMail(emailTemplate: IEmailTemplate): Promise<void> {

        // Email address fields (to, from, cc, bcc, replyTo)
        // https://github.com/sendgrid/sendgrid-nodejs/blob/master/docs/use-cases/flexible-address-fields.md

        /*to: {
            name: 'Some One',
            email: 'someone@example.org',
        },*/
        const email: EmailData  = {
            from: this.from,
            replyTo: this.replyTo,
            templateId: emailTemplate.templateId,
            personalizations: [
                {
                    subject: emailTemplate.subject,
                    to: emailTemplate.to,
                    dynamicTemplateData: emailTemplate.templateData,
                    // Values that are specific to this personalization that will be carried along with the email and its activity data. 
                    customArgs: {
                        myArg: 'Recipient 1',
                    },
                },
            ],
            // An array of category names for this message. Each category name may not exceed 255 characters. Max 10.
            categories: ['Transactional', 'My category'],
        };

        switch (emailTemplate.templateType) {
            case EmailTemplateType.TEMPLATE_ID:
                email.templateId = emailTemplate.templateId;
                break;
            case EmailTemplateType.TEXT:
                email.text = emailTemplate.getText();
                break;
            case EmailTemplateType.HTML:
                email.html = emailTemplate.getHtml();
                break;
            case EmailTemplateType.TEXT_AND_HTML:
                email.text = emailTemplate.getText();
                email.html = emailTemplate.getHtml();
                break;
        }

        const msg = {
            to: 'test@example.com',
            from: 'test@example.com',
            replyTo: 'othersender@example.org',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            templateId: 'd-12345678901234567890123456789012',
            dynamicTemplateData: {
                name: 'Some One',
                id: '123',
            },
            categories: ['Transactional', 'My category'],
            
            customArgs: {
                myCustomArg: 'some string', // must be a string
            },
        };


        //to: ['recipient1@example.org', 'recipient2@example.org'],
        // The to field can contain an array of recipients, which will send a single email with all of the recipients in the to field. 
        // The recipients will be able to see each other

        // If you want to send multiple individual emails to multiple recipient where they don't see each other's email addresses
        // sgMail.sendMultiple(msg);

        try {
            await sendgridMailer.send(<any>email);
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    }
}
