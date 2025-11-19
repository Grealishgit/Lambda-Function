import https from "https";

export default async function handler(req, res) {
    const url = "https://bwm-xmd-go-av72.onrender.com";

    console.log(`[PING] Attempting to reach: ${url}`);

    try {
        const result = await pingExternal(url);
        res.status(200).json({
            message: "Server pinged successfully",
            status: result
        });
    } catch (error) {
        console.error(`[PING ERROR] ${error.message}`);
        res.status(500).json({
            message: "Ping failed",
            error: error.message
        });
    }
}

function pingExternal(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            console.log(`[STATUS] ${response.statusCode}`);

            if (response.statusCode === 200) {
                resolve("OK");
            } else {
                reject(new Error(`Bad status code: ${response.statusCode}`));
            }
        });

        request.on("error", (err) => reject(err));
        request.end();
    });
}
