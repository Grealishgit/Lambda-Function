import twilio from 'twilio';
import 'dotenv/config';
import quotes from './quotes.js'


export async function sendStatusWhatsApp(statuses) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    if (!accountSid || !authToken) {
        console.error('Twilio credentials missing. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
        return { success: false, error: 'Twilio credentials missing' };
    }

    const time = new Date().toLocaleTimeString('en-KE', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // 2. Build the list with icons
    const list = statuses.map(s => {
        const isUp = s.status === 200;
        const icon = isUp ? '✅' : '🔴';
        // Format: Icon [Status] URL
        return `${icon} *${s.status || 'ERR'}* | ${s.url}`;
    }).join('\n');

    // 3. Assemble the final message
    const body = `*📊 SERVER HEALTH REPORT*\n` +
        `🕒 _Checked at ${time}_\n` +
        `────────────────\n` +
        `${list}\n` +
        `────────────────\n` +
        `🤖 _System Monitor By HunterDev!_\n` +
        `────────────────\n\n` +  
        `💡 Quote of the moment:\n${quotes.getRandom()}`;

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