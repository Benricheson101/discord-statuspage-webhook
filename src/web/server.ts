import {createServer, IncomingMessage, ServerResponse} from "http";
import List from "./List";
import {parse, UrlWithParsedQuery} from "url";
import * as fetch from "node-fetch";
import * as FormData from "form-data";
import {oauth} from "../config";
import {router} from "./router";

const port: number = 53134;
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
                throw err;
            });

        list.data = webhook;
        await list.save();

        await send(webhook, {
            content: "[Discord status page](https://status.discordapp.com) updates will be sent to this channel."
        })

    }
    router.checkRoute(urlObj.pathname, res, req);
})
    .listen(port);

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

async function send(destination, embed: Object) {
    await fetch(`https://discordapp.com/api/webhooks/${destination.id}/${destination.token}`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(embed)
    })
        .catch((err: Error) => {
            throw err;
        });
}
