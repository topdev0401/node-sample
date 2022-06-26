import * as dotenv from "dotenv";

// Default to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = dotenv.config();
if (!config) {
    throw new Error(".env file not found!");
}

const requiredEnvVars = [
    "API_PORT",
    "API_BASE_ADDRESS",
    "APP_BASE_ADDRESS",
    "APP_NAME",
    "HTTPS_ENABLED",
    "HTTPS_KEY_PATH",
    "HTTPS_CERT_PATH",
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_ISSUER",
    "JWT_AUDIENCE",
    "FROM_EMAIL_NAME",
    "FROM_EMAIL_ADDRESS",
    "REPLY_EMAIL_NAME",
    "REPLY_EMAIL_ADDRESS",
    "SENDGRID_API_KEY",
    "CALL_TO_ACTION_TEMPLATE_ID",
    "VERIFICATION_CODE_LENGTH",
    "ACCESS_TOKEN_LENGTH",
    "SENDINBLUE_API_KEY",
    "ADMIN_EMAIL_NAME",
    "ADMIN_EMAIL_ADDRESS"
];

for (const requiredEnvVar of requiredEnvVars) {
    if (!process.env[requiredEnvVar]) {
        throw new Error(`${requiredEnvVar} must be specified in the .env file!`);
    }
}

export default {
    /**
    * Environment
    */
    environment: process.env.NODE_ENV,

    api: {
        /**
        * API Port
        */
        port: parseInt(process.env.API_PORT, 10),
        /**
        * API Base Address
        */
        baseAddress: process.env.API_BASE_ADDRESS,
        /**
        * API Scheme (http or https)
        */
        scheme: process.env.HTTPS_ENABLED === "true" ? "https" : "http"
    },
    app: {
        /**
        * App Name
        */
        name: process.env.APP_NAME,
        /**
        * App Base Address
        */
        baseAddress: process.env.APP_BASE_ADDRESS,
        /**
        * App Scheme (http or https)
        */
        scheme: process.env.HTTPS_ENABLED === "true" ? "https" : "http",
        /**
        * App Routes used for CTA emails
        */
        accountConfirmationUrl: function (email: string, verificationCode: string) {
            return `${process.env.HTTPS_ENABLED === "true" ? "https" : "http"}://${process.env.APP_BASE_ADDRESS}/account-activation?email=${email}&verificationCode=${verificationCode}`;
        },
        resetPasswordUrl: (email: string, verificationCode: string) => {
            return `${process.env.HTTPS_ENABLED === "true" ? "https" : "http"}://${process.env.APP_BASE_ADDRESS}/reset-password?email=${email}&verificationCode=${verificationCode}`;
        },
        getGolfClubPageUrl : function(clubId:string) {
            return `${process.env.HTTPS_ENABLED === "true" ? "https" : "http"}://${process.env.APP_BASE_ADDRESS}/access/golf-course-details/${clubId}`;
        }
    }, 
    /**
    * HTTPS
    */
    https: {
        isEnabled: process.env.HTTPS_ENABLED === "true",
        keyPath: process.env.HTTPS_KEY_PATH,
        certPath: process.env.HTTPS_CERT_PATH
    },
    /**
    * Winston logging
    * Default to 'silly'
    */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    /**
    * Mongo DB URI
    */
    mongoDbUri: process.env.MONGODB_URI,

    /**
    * JWT
    */
    jwtSecret: process.env.JWT_SECRET,
    jwtIssuer: process.env.JWT_ISSUER,
    jwtAudience: process.env.JWT_AUDIENCE,

    /**
    * Email
    */
    email: {
        fromEmail: {
            name: process.env.FROM_EMAIL_NAME,
            email: process.env.FROM_EMAIL_ADDRESS
        },
        replyEmail: {
            name: process.env.REPLY_EMAIL_NAME,
            email: process.env.REPLY_EMAIL_ADDRESS
        },
        sendgridApiKey: process.env.SENDGRID_API_KEY,
        emailTemplate: {
            callToActionTemplateId: process.env.CALL_TO_ACTION_TEMPLATE_ID,
        },
        sendinblueApiKey: process.env.SENDINBLUE_API_KEY,
        adminEmail: {
            name: process.env.ADMIN_EMAIL_NAME,
            email: process.env.ADMIN_EMAIL_ADDRESS
        }
    },
    /**
    * Golf course and club data
    */
    dataImportFilePath: process.env.DATA_IMPORT_FILE_PATH,
    dataImportFilePathNew: process.env.DATA_IMPORT_FILE_PATH_NEW,
    dataTransformFilePath: process.env.DATA_TRANSFORM_FILE_PATH,
    dataImportKey: process.env.DATA_IMPORT_KEY,

    /**
    * Lengths for code generator
    */
    verificationCodeLength: process.env.VERIFICATION_CODE_LENGTH,
    accessTokenLength: process.env.ACCESS_TOKEN_LENGTH,
};
