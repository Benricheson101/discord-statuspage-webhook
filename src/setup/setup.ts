import {accessSync, promises} from "fs";
import fetch from "node-fetch";

let templates: Templates = {
    config: `\
module.exports.setup = {
    content: "The status page has been updated.", // leave blank for no message
    port: 80
};

module.exports.oauth = {
    client_id: "",
    client_secret: "",
    grant_type: "authorization_code",
    redirect_uri: "",
    scopes: "webhook.incoming"
};`,
    webhooks: `\
{
  "webhooks": []
}`
};

(async function runSetup() {

    if (!checkPath("src/config.js")) {
        console.log("Making a template config file");
        await promises.writeFile("src/config.js", templates.config);
    }

    if (!checkPath("src/webhook/webhooks.json")) {
        console.log("Making webhooks.json");
        await promises.writeFile("src/webhook/webhooks.json", templates.webhooks);
    }

    console.log("Fetching data for latest.json");
    let statusData = await fetch("https://status.discord.com/index.json")
        .then((res: any) => res.json());
    await promises.writeFile("src/webhook/latest.json", JSON.stringify(await statusData, null, 2));

    console.log("Automatic setup complete. Note: You must setup config.js prior to use.")
})();

/**
 * Check if a file exists
 * @param {string} path - What file to check
 * @returns {boolean}
 */
function checkPath(path: string): boolean {
    try {
        let exists: any = accessSync(path);
        return !(exists instanceof Error);
    } catch {
        return false;
    }
}

interface Templates {
    config: string;
    webhooks: string;
}
