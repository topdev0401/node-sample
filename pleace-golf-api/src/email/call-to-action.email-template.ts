import { IEmailTemplate, EmailTemplateType } from "../core/email/email-template.interface";
import { EmailAddress } from "../core/email/email-address";


export interface CallToActionData {
    header: string;
    text: string;
    c2aLink?: string;
    c2aButton?: string;
    firstName?:string;
    lastName?:string;
    category?:string;
    type?:string;
    stageName?:string;
    requestedByName?:string;
    requestedByEmail?:string;
    country?:string;
    clubName?:string;
    actionBy?:string;
    regarding?:string;
    details?:string;
}

export class CallToActionEmailTemplate implements IEmailTemplate{
    subject: string;
    to: EmailAddress;
    templateId?: string;
    templateData: CallToActionData;
    templateType = EmailTemplateType.TEMPLATE_ID;

    getText(): string {
        throw new Error("Not implemented.");
    }
    getHtml(): string {
        throw new Error("Not implemented.");
    }
}
