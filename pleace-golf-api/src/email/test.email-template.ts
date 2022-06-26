import { IEmailTemplate, EmailTemplateType } from "../core/email/email-template.interface";
import { EmailAddress } from "../core/email/email-address";

export class TestEmailTemplate implements IEmailTemplate{
    subject: string;
    to: EmailAddress;
    templateId?: string;
    templateData: any;

    templateType = EmailTemplateType.TEXT;

    getText(): string {
        return "Test email...";
    }
    getHtml(): string {
        return "<b>Test email...</b>";
    }
}
