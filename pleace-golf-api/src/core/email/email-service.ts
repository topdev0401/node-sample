/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { IEmailTemplate } from "./email-template.interface";
import { EmailAddress } from "./email-address";

export abstract class EmailService {

    constructor(protected from: EmailAddress, protected replyTo: EmailAddress) {
    }

    // 'Some One <someone@example.org>'
    formatEmailAsNameAndAddress(emailAddress: EmailAddress) {
        if (emailAddress.name) {
            return `${emailAddress.name} <${emailAddress.email}>`;
        }
        else {
            return emailAddress.email;
        }
    }

    validateEmailAddress(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            return (true)
        }
        return (false)
    }

    abstract sendMail(emailTemplate: IEmailTemplate,job?:String): Promise<void>;
    //abstract async sendPlainTextMail(emailTemplate: IEmailTemplate): Promise<void>;
}