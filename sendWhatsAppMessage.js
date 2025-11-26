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

    // const time = new Date().toLocaleTimeString('en-KE', {
    //     timeZone: 'Africa/Nairobi',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit'
    // });

    /* format time and date to  20th August 2024, 14:30:15 */
    const formattedDateTime = new Date().toLocaleDateString('en-KE', {
        timeZone: 'Africa/Nairobi',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
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
        `🕒 _Checked at ${formattedDateTime}_\n` +
        `──────────────────────────────────\n` +
        `${list}\n` +
        `\n` +
        ` _System Monitor By H͟u͟n͟t͟e͟r͟D͟e͟v͟!_\n` +
        `──────────────────────────────────\n\n` +
        `💡 *Quote of the moment*:\n${quotes.getRandom()}`;

    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            mediaUrl: ["https://res.cloudinary.com/da35m1zxz/image/upload/v1764181369/servers_q30ysw.jpg"],
            to: "whatsapp:+254742636835",
        });
        console.log(`WhatsApp status message sent: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('Error sending status WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}