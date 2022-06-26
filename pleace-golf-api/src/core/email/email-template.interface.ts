/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { EmailAddress } from "./email-address";

export enum EmailTemplateType {
    TEMPLATE_ID, TEXT, HTML, TEXT_AND_HTML
}

export interface IEmailTemplate {
    subject: string;
    to: EmailAddress;
    templateData?: any;
    templateType: EmailTemplateType;
    templateId?: string;
    getText(): string;
    getHtml(): string;
}