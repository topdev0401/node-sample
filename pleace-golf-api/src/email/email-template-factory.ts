import { CallToActionEmailTemplate, CallToActionData } from "./call-to-action.email-template";
import config from "../config";

export class EmailTemplateFactory {

    public static createCallToActionEmailTemplate(subject: string, toName: string, toEmail: string, data: CallToActionData): CallToActionEmailTemplate {

        const emailTemplate = new CallToActionEmailTemplate();
        emailTemplate.subject = subject;
        emailTemplate.to = {
            name: toName,
            email: toEmail
        };
        emailTemplate.templateId = config.email.emailTemplate.callToActionTemplateId;
        emailTemplate.templateData = data;

        return emailTemplate;
    }

    public static createActivateAccountTemplate(toName: string, toEmail: string, c2aLink: string): CallToActionEmailTemplate {

        const subject = `Activate your ${config.app.name} account`;

        const callToActionData = {
            subject: subject,
            header: `Welcome to ${config.app.name}!`,
            text: `Please activate your account by clicking on the button below.`,
            c2aLink: c2aLink,
            c2aButton: "Activate Account"
        } as CallToActionData;

        return this.createCallToActionEmailTemplate(
            subject,
            toName,
            toEmail,
            callToActionData
        );
    }

    public static createResetPasswordRequestTemplate(toName: string, toEmail: string, c2aLink: string): CallToActionEmailTemplate {

        const subject = `${config.app.name} password reset request`;

        const callToActionData = {
            subject: subject,
            header: `Password reset request`,
            text: `A request has been received to change the password for your ${config.app.name} account.`,
            c2aLink: c2aLink,
            c2aButton: "Reset Password"
        } as CallToActionData;

        return this.createCallToActionEmailTemplate(
            subject,
            toName,
            toEmail,
            callToActionData
        );
    }

    public static createInviteeRequestTemplate(toName: string, toEmail: string, inviteeForm: any): CallToActionEmailTemplate {

        const subject = `${config.app.name} - Create Invitee Request`;

        const callToActionData = {
            subject: subject,
            header: `New Request !`,
            text: `Please verify the invitation below`,
            firstName: inviteeForm.firstName,
            lastName: inviteeForm.lastName,
            category: inviteeForm.category,
            type: inviteeForm.type,
            stageName: inviteeForm.stageName,
            requestedByEmail:inviteeForm.requestedByEmail,
            requestedByName:inviteeForm.requestedByName,
            c2aButton:'Verify',
            c2aLink:config.app.baseAddress+'/admin-panel/verify-invitee/'+inviteeForm._id,
            country:inviteeForm.country
        } as CallToActionData;

        return this.createCallToActionEmailTemplate(
            subject,
            toName,
            toEmail,
            callToActionData
        );
    }

    public static createNotifyClubTemplate(clubEmailInfo: any): CallToActionEmailTemplate {

        const subject = clubEmailInfo.clubName +' - '+clubEmailInfo.subject;
        const callToActionData = {
            subject: subject,
            header: `Update Golf Club Details !`,
            text: clubEmailInfo.body,
            c2aButton:'Update',
            c2aLink:clubEmailInfo.golfClubPageUrl,
            clubName: clubEmailInfo.clubName,
            country : clubEmailInfo.countryCode,
        } as CallToActionData;

        return this.createCallToActionEmailTemplate(
            subject,
            clubEmailInfo.clubName,
            clubEmailInfo.clubEmail,
            callToActionData
        );
    }

    public static createGolfClubUpdateNotificationTemplete(clubInfo: any,operation:string): CallToActionEmailTemplate {
        let subject = '';
        if(operation === 'add') {
            subject = 'New Golf Club Added - '+ clubInfo.name;
        } else if(operation === 'delete') {
            subject = 'Golf Club Deleted - '+ clubInfo.name;
        } else {
            subject = 'Golf Club Updated - '+ clubInfo.name;
        }
        const callToActionData = {
            subject: subject,
            header: `Golf Club Details !`,
            text: 'Greeting from PLeace Golf, Below Golf Club is updated in pleacegolf.world app.',
            c2aButton:'Have a look !',
            c2aLink:clubInfo.golfClubPageUrl,
            clubName: clubInfo.name,
            country : clubInfo.countryCode,
            actionBy: clubInfo.actionBy
        } as CallToActionData;

        return this.createCallToActionEmailTemplate(
            subject,
            clubInfo.name,
            clubInfo.email,
            callToActionData
        );
    }

    public static createNeedHelpTemplete(needHelpForm: any,toName: string, toEmail: string): CallToActionEmailTemplate {
        const subject = 'PLeace Golf - Need Help';
        const callToActionData = {
            subject: subject,
            header: `Need Help in PLeace Golf !`,
            text: 'Someone need your help in PLeace Golf app. Below are details',
            c2aButton:'Go to app',
            c2aLink:'pleacegolf.world',
            clubName: needHelpForm.club,
            country : needHelpForm.country,
            requestedByName: needHelpForm.requestedByName,
            regarding: needHelpForm.regarding,
            requestedByEmail: needHelpForm.requestedByEmail,
            details : needHelpForm.details
        } as CallToActionData;

        return this.createCallToActionEmailTemplate(
            subject,
            toName,
            toEmail,
            callToActionData
        );
    }
}