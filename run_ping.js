import { pingAll } from './cron.js';
import { sendStatusWhatsApp } from './sendWhatsAppMessage.js';

(async () => {
    try {
        console.log('Running one-off ping test...');
      const statuses = await pingAll();
      console.log('Statuses:', statuses);
      console.log('Sending WhatsApp status message...');
      const result = await sendStatusWhatsApp(statuses);
      console.log('WhatsApp result:', result);
      console.log('One-off ping test finished.');
      process.exit(0);
  } catch (err) {
      console.error('One-off ping test failed:', err);
      process.exit(1);
  }
})();