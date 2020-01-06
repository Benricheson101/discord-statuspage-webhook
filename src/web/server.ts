import {createServer, IncomingMessage, ServerResponse} from "http";
import List from "./List";
import {parse, UrlWithParsedQuery} from "url";
import * as fetch from "node-fetch";
import * as FormData from "form-data";
import {oauth, setup} from "../config";
import {router} from "./router";

export const list = new List("src/webhook/webhooks.json");
console.log("Server started.");
createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const urlObj: UrlWithParsedQuery = parse(req.url, true);
    if (urlObj.query.code) {
        const accessCode: string | string[] = urlObj.query.code;
        const data: FormData = new FormData();

        data.append("client_id", oauth.client_id);
        data.append("client_secret", oauth.client_secret);
        data.append("grant_type", oauth.grant_type);
        data.append("redirect_uri", oauth.redirect_uri);
        data.append("scopes", oauth.scopes);
        data.append("code", accessCode);

        let {webhook}: IncomingWebhook = await fetch("https://discordapp.com/api/oauth2/token", {
            method: "POST",
            body: data
        })
            .then((res: any) => {
                res = res.json();
                return res;
            })
            .catch((err: Error) => {
                router.checkRoute("/error", req, res);
                throw err;
            });

        if (!webhook) {
            router.checkRoute("/error", req, res);
            return;
        }

        list.data = webhook;
        await list.save();

        await send(webhook, {
            content: "This channel will now receive [Discord status page](https://status.discordapp.com) updates.\nTo stop receiving these updates, simply delete the webhook."
        })
    }
    router.checkRoute(urlObj.pathname, req, res);
})
    .listen(setup.port);

async function send(destination: SavedWebhook, embed: Object) {
    await fetch(`https://discordapp.com/api/webhooks/${destination.id}/${destination.token}`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(embed)
    })
        .catch((err: Error) => {
            throw err;
        });
}

interface IncomingWebhook {
    webhook: {
        type: number;
        id: string;
        name: string;
        avatar: string;
        channel_id: string
        guild_id: string;
        token: string;
        url: string;
    }
}

interface SavedWebhook {
    id: string;
    token: string;
    guild_id?: string;
    channel_id?: string;
}
