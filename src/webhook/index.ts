"use strict";
import Status from "./Status";
import * as fetch from "node-fetch";
import {hook} from "../config";
import {list} from "../web/server";


console.log("Running.");
async function start() {
    console.log("Checking for updates.");
    let status = new Status("/index.json");
    let current: object = await status.getCurrent();
    let saved: object = await status.getSaved();
    if (current["incidents"][0].updated_at !== saved["incidents"][0].updated_at) {
        let newIncident: object = current["incidents"][0];
        let description: string[] = [];
        if (newIncident["status"] !== "resolved") {
            description.push(`**${newIncident["name"]}**`);
            if (newIncident["incident_updates"].length > 0) {
                description.push(
                    "**Status**: " + newIncident["incident_updates"][0].status,
                    "**Info**: " + newIncident["incident_updates"][0].body,
                );
            } else description.push("No updates have been published.")
        } else description.push(newIncident["incident_updates"][0].body);
        let embed: object = {
            "content": hook.content,
            "embeds": [{
                "title": "Status Page Update",
                "url": newIncident["status"] === "resolved" ? newIncident["shortlink"] : "https://status.discordapp.com/",
                "color": await status.genColor(),
                "description": description.join("\n"),
                "timestamp": newIncident["incident_updates"][0].created_at
            }]
        };
        await status.save();
        await send(embed);
        return;
    }

    async function send(embed: Object) {
        for (const hook of list.getSaved) {
            try {
                await fetch(`https://discordapp.com/api/webhooks/${hook.id}/${hook.token}`, {
                    method: "post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(embed)
                })
                    .then((res: any) => {
                        if (res.status !== 204) list.delete(hook.id)
                    })
                    .catch((err: Error) => {
                        throw err;
                    });

            }
            catch (err) {
                throw err;
            }
        }
    }
}

start()
    .catch((err: Error) => {
        throw err;
    });
setInterval(() => {
    start()
        .catch((err: Error) => {
            throw err;
        });
}, 300000); // runs every 5 minutes

interface Webhook {
    readonly id: string;
    readonly token: string;
    readonly guild_id: string;
}

