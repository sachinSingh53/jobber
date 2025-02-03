import { config } from '../config.js';

import { createConnection } from './connection.js';
import { sendEmail } from './mailTransport.js';

async function consumeAuthEmailMessages(channel) {
    try {
        if (!channel) {
            channel = await createConnection();
        }
        const exchangeName = 'jobber-email-notification';
        const routingKey = 'auth-email';
        const queueName = 'auth-email-queue';

        // Asserting exchange with the specified name and type 'direct'
        await channel.assertExchange(exchangeName, 'direct');

        // Asserting queue with the specified name and options (durable and autoDelete)
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

        // Binding the queue to the exchange with the specified routing key
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

        // Consuming messages from the queue
        channel.consume(jobberQueue.queue, async (msg) => {
            const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
            const locals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://ih1.redbubble.net/image.367014180.4385/st,small,507x507-pad,600x600,f8f8f8.u3.jpg',
                username,
                verifyLink,
                resetLink,
            };

            //send email
            // console.log(receiverEmail, username, verifyLink, resetLink, template);

            await sendEmail(template, receiverEmail, locals);
            //ack
            channel.ack(msg);
        });
    } catch (err) {
        console.log(err);
    }
}

async function consumeOrderEmailMessages(channel) {
    try {
        if (!channel) {
            channel = await createConnection();
        }
        const exchangeName = 'jobber-order-notification';
        const routingKey = 'order-email';
        const queueName = 'order-email-queue';

        // Asserting exchange with the specified name and type 'direct'
        await channel.assertExchange(exchangeName, 'direct');

        // Asserting queue with the specified name and options (durable and autoDelete)
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

        // Binding the queue to the exchange with the specified routing key
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

        // Consuming messages from the queue
        channel.consume(jobberQueue.queue, async (msg) => {

            //send email

            const {
                sellerEmail,
                buyerEmail,
                receiverEmail,
                username,
                template,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
                
            } = JSON.parse(msg.content.toString());

            const locals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                username,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
            };

            if (template === 'orderPlaced') {
                await sendEmail('orderPlaced', sellerEmail, locals);
                await sendEmail('orderReceipt', buyerEmail, locals);
            } else {
                await sendEmail(template, receiverEmail, locals);
            }
            //ack
            channel.ack(msg);
        });
    } catch (err) {
        console.log(err);
    }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };
