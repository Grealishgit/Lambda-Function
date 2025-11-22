import twilio from 'twilio';
import 'dotenv/config';


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