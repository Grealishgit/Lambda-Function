import handler from "./ping-external.js";

export default async function cron(req, res) {
    console.log("[CRON] Automatic ping triggered");
    return handler(req, res);
}
