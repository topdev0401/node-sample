import * as nodemailer from "nodemailer";
import { EmailAddress } from "./email-address";
import * as SibApiV3Sdk from "sib-api-v3-sdk";
import { IEmailTemplate } from "./email-template.interface";
import { EmailService } from "./email-service";
import { EmailHtmlTemplate } from "./email-html-template";
import { Job } from "../../jobs/job.enum";

export class SendinblueEmailService extends EmailService  {
    //reply to is admin email id
    constructor(protected sendinblueApiKey: string, protected from: EmailAddress, protected replyTo: EmailAddress) {
        super(
            from, replyTo
        );
    }

    async sendMail(emailTemplate: IEmailTemplate,job:String) {

        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey =  this.sendinblueApiKey;
        
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        let htmlContent = '';
        
        if(job === Job.CreateInviteeRequestJob) {
            htmlContent = EmailHtmlTemplate.getCreateInviteeTemplate();
        } else if(job === Job.NotifyClubsUpdateCourseJob) {
            htmlContent = EmailHtmlTemplate.getNotifyClubTemplate();
        } else if(job === Job.GolfClubUpdatedNotificationJob) {
            htmlContent = EmailHtmlTemplate.getGolfClubUpdatedTemplate();
        } else if(job === Job.needHelpJob) {
            htmlContent = EmailHtmlTemplate.getNeedHelpTemplate();
        } else {
            htmlContent = EmailHtmlTemplate.getPleaceGolfTemplate();
        }
        sendSmtpEmail.subject = emailTemplate.subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { "name": this.from.name, "email": this.from.email };
        
        if(job === Job.GolfClubUpdatedNotificationJob || job === Job.NotifyClubsUpdateCourseJob) { 
            if(super.validateEmailAddress(emailTemplate.to.email)) {
                //club and admin both
                sendSmtpEmail.to = [
                    { "email": emailTemplate.to.email, "name": emailTemplate.to.name },
                    { "email": this.replyTo.email, "name": this.replyTo.name }
                ];
            } else {
                //only admin
                sendSmtpEmail.to = [{ "email": this.replyTo.email, "name": this.replyTo.name }];
            }
            sendSmtpEmail.templateId = 5;
        } else {
            //to user
            sendSmtpEmail.to = [
                { "email": emailTemplate.to.email, "name": emailTemplate.to.name }
            ];
        } 
        //sendSmtpEmail.cc = [{ "email": this.replyTo.email, "name": this.replyTo.name }];
        //sendSmtpEmail.bcc = [{ "email": "John Doe", "name": "example@example.com" }];
        sendSmtpEmail.replyTo = { "email": this.replyTo.email, "name": this.replyTo.name};
        sendSmtpEmail.headers = { "Some-Custom-Name-192012": "unique-id-123238239231214" };
        sendSmtpEmail.params = emailTemplate.templateData;
        
        //console.log('sendSmtpEmail: ',sendSmtpEmail);
        //apiInstance.
        //apiInstance.seb
        
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('Email sent successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
            console.error(error);
        });
    }

    /* async sendMail(emailTemplate: IEmailTemplate) {

        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey =  this.sendinblueApiKey;

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = "My {{params.subject}}";
        sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
        sendSmtpEmail.sender = { "name": "Sandeep Knit", "email": "sande.knit@gmail.com" };
        sendSmtpEmail.to = [{ "email": "sande991@gmail.com", "name": "Sandeep verma" }];
        //sendSmtpEmail.cc = [{ "email": "example2@example2.com", "name": "Janice Doe" }];
        //sendSmtpEmail.bcc = [{ "email": "John Doe", "name": "example@example.com" }];
        //sendSmtpEmail.replyTo = { "email": "replyto@domain.com", "name": "John Doe" };
        sendSmtpEmail.headers = { "Some-Custom-Name-192012": "unique-id-123238239231214" };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "New Subject" };

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
            console.error(error);
        });
    } */
}