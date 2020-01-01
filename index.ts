"use strict";
import Status from "./src/Status";
import * as fetch from "node-fetch";
import * as config from "./config";

async function start() {
    let status = await new Status("/index.json");
    let current = await status.getCurrent();
    let saved = await status.getSaved();
    if (current.incidents[0].updated_at !== saved.incidents[0].updated_at) {
        let newIncident = current.incidents[0];
        let description = [];
        if (newIncident.status !== "resolved") {
            description.push(`**${newIncident.name}**`);
            if (newIncident.incident_updates.length > 0) {
                description.push(
                    "**Status**: " + newIncident.incident_updates[0].status,
                    "**Info**: " + newIncident.incident_updates[0].body,
                );
            } else description.push("No updates have been published.")
        } else description.push("All incidents have been resolved!");
        let embed = {
            "content": config.content,
            "embeds": [{
                "title": "Status Page Update",
                "url": newIncident.status === "resolved" ? newIncident.shortlink : "https://status.discordapp.com/",
                "color": await status.genColor(),
                "description": description.join("\n"),
                "timestamp": newIncident.incident_updates[0].created_at
            }]
        };
        await status.save();
        await send(config.webhook, embed);
        return;
    }

    async function send(destination: Webhook, embed: Object) {
        await fetch(`https://discordapp.com/api/webhooks/${destination.id}/${destination.token}`, {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(embed)
        })
            .catch((err) => {
                throw new Error(err);
            });
    }
}

setInterval(() => {
    start()
        .catch((err) => {
            throw new Error(err);
        });
}, 300000); // runs every 5 minutes

interface Webhook {
    readonly id: string;
    readonly token: string;
}

