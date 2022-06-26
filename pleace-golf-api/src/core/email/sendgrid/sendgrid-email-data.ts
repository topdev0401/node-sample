/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { EmailAddress } from "../email-address";

export interface PersonalizationData {
    to: EmailAddress | EmailAddress[],
    cc?: EmailAddress | EmailAddress[],
    bcc?: EmailAddress | EmailAddress[],
    subject?: string;
    dynamicTemplateData?: { [key: string]: any; };
    customArgs?: { [key: string]: string };
}

export interface EmailData {
    from: EmailAddress,
    replyTo?: EmailAddress,

    text?: string,
    html?: string,
    templateId?: string,

    personalizations?: PersonalizationData[],
    categories?: string[],

    dynamicTemplateData?: { [key: string]: any },
}