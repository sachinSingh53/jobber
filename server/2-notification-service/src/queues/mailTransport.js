import { emailTemplates } from '../helper.js';

async function sendEmail(template, receiverEmail, locals) {
    try {
        await emailTemplates(template, receiverEmail, locals);
    } catch (err) {
        console.log(err);
    }
}

export { sendEmail };
