import twilio from 'twilio';
import 'dotenv/config';

export const sendWhatsAppMessage = (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);


    async function createMessage() {
        try {
            const message = await client.messages.create({
                body: "Your verification code is 123456",
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                mediaUrl: ["https://demo.twilio.com/owl.png"],
                statusCallback: "https://hunterdev.live",
                to: "whatsapp:+254742636835",
            });
            res.status(200).json({
                message: 'WhatsApp Message Sent Successfully',
                success: true,
                sid: message.sid,
                body: message.body
            });
            console.log(message);
            console.log(message.sid);
            return;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            res.status(500).json({
                message: 'Failed to send WhatsApp message',
                success: false,
                error: error.message
            });
            return;
        }
    }
    createMessage();
}


export async function sendStatusWhatsApp(statuses) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    if (!accountSid || !authToken) {
        console.error('Twilio credentials missing. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
        return { success: false, error: 'Twilio credentials missing' };
    }

    const body = `URL Status Update:\n${statuses.map(s => `${s.url}: ${s.status}`).join('\n')}`;

    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: "whatsapp:+254742636835",
        });
        console.log(`WhatsApp status message sent: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('Error sending status WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}