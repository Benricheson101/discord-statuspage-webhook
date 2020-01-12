"use strict";
import Status from "./Status";
import * as fetch from "node-fetch";
import {setup} from "../config";
import {list} from "../web/server";

console.log("Script started successfully.");

run(); // run immediately on start
setInterval(() => run(), 300000); // then run every 5 minutes

async function start() {
    let status = new Status("/index.json");
    let current: object = await status.getCurrent();
    let saved: object = await status.getSaved();
    if (Object.keys(saved).length < 1) return await status.save();

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
            "content": setup.content,
            "embeds": [{
                "title": "Status Page Update",
                "url": newIncident["shortlink"] || "https://status.discordapp.com/",
                "color": await status.genColor(),
                "description": description.join("\n"),
                "timestamp": newIncident["incident_updates"][0].created_at,
                "footer": {
                    "text": "Made by: Ben.#0002"
                }
            }]
        };
        await status.save();
        await send(embed);
        return;
    }

    async function send(embed: object) {
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
            } catch (err) {
                throw err;
            }
        }
    }
}

function run() {
    start()
        .catch((err: Error) => {
            throw err;
        })
}
