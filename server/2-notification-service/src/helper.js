import nodemailer from 'nodemailer';
import { config } from './config.js';
import Email from 'email-templates';
import path from 'path';
import { winstonLogger } from '@sachinsingh53/jobber-shared';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'emailTemplates', 'debug');
const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function emailTemplates(template, receiverEmail, locals) {
    try {
        // Creating nodemailer transport using Gmail's SMTP
        const smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASSWORD
            }
        });

        // Creating Email instance
        const email = new Email({
            message: {
                from: `Jobber App <${config.SENDER_EMAIL}>` // Use your Gmail email address here
            },
            send: true,
            preview: false,
            transport: smtpTransport,
            views: {
                options: {
                    extension: 'ejs'
                }
            },
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: path.join(__dirname, '..', 'src/emails')
                }
            }
        });

        // Sending email using the specified template and locals
        await email.send({
            template: path.join(__dirname, '..', 'src/emails', template),
            message: { to: receiverEmail },
            locals // Variables used in the email template
        });

        log.info(`(${template}) Email Sent Successfully`);

    } catch (err) {
        log.error('error in emailTemplates()', err);
    }
}

export { emailTemplates };
