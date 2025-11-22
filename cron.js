import { CronJob } from 'cron';
import https from 'https';
import { URL } from 'url';
import { sendStatusWhatsApp } from './sendWhatsAppMessage.js';

const urls = [
    'https://bwm-xmd-go-5tnq.onrender.com',
    'https://bwm-xmd-go-av72.onrender.com',
    'https://bwm-xmd-go-pk6k.onrender.com'
];

async function fetchUrl(url, timeout = 10000) {
    // Use global fetch if available (Node 18+), otherwise fall back to https.request
    if (typeof fetch === 'function') {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { method: 'GET', signal: controller.signal });
            clearTimeout(id);
            return { ok: res.ok, status: res.status };
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            method: 'GET',
            timeout
        };

        const req = https.request(u, options, (res) => {
            // drain the response
            res.on('data', () => { });
            res.on('end', () => {
                resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode });
            });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
            req.destroy(new Error('Request timed out'));
        });
        req.end();
    });
}

export async function pingAll() {
    const results = [];
    for (const url of urls) {
        try {
            const res = await fetchUrl(url);
            console.log(`[${new Date().toISOString()}] PING ${url} => ${res.status}`);
            results.push({ url, status: res.status, ok: res.ok });
        } catch (err) {
            console.error(`[${new Date().toISOString()}] ERROR ping ${url}:`, err && err.message ? err.message : err);
            results.push({ url, status: 'ERROR', ok: false, error: err.message });
        }
    }
    return results;
}

// Run every 30 minutes at 0 seconds (every 30 minutes)
export const job = new CronJob(
    '0 0 */3 * * *', // cronTime: at second 0 of every 30 minutes
    async function () {
        console.log(`[${new Date().toISOString()}] Starting scheduled ping job`);
        const statuses = await pingAll();
        await sendStatusWhatsApp(statuses);
    }, // onTick
    null, // onComplete
    true, // start immediately
    'Africa/Nairobi' // timeZone
);