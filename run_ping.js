import { pingAll } from './cron.js';

(async () => {
    try {
        console.log('Running one-off ping test...');
        await pingAll();
        console.log('One-off ping test finished.');
        process.exit(0);
    } catch (err) {
        console.error('One-off ping test failed:', err);
        process.exit(1);
    }
})();
