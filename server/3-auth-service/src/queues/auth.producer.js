import { createConnection } from "./connection.js";

async function publishDirectMessage(channel, exchangeName, routingKey, message) {
    try {   
        if (!channel) {
            channel = await createConnection();
        }
        await channel.assertExchange(exchangeName, 'direct');
        channel.publish(exchangeName, routingKey, Buffer.from(message));
        
    } catch (error) {
        throw new Error('error in publishDirectMessage(): ' + error);
    }
}

export { publishDirectMessage };
