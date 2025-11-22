import express from 'express';
import { job } from './cron.js';
import { pingAll } from './cron.js';
import 'dotenv/config';

const app = express();
const PORT = 4000;
app.use(express.json());

job.start();


// app.get('/', (req, res) => {
//     (async () => {
//         try {
//             console.log('Running one-off ping test...');
//             await pingAll();
//             console.log('One-off ping test finished.');
//             process.exit(0);
//         } catch (err) {
//             console.error('One-off ping test failed:', err);
//             process.exit(1);
//         }
//     })();
// });

app.get('/status', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})