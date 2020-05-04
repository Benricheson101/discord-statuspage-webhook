import * as fetch from "node-fetch";
import {promises, writeFileSync} from "fs";
import {stringify} from "querystring";

export default class Status {
    private _base: string = "https://status.discord.com";
    readonly url: string;

    constructor(private path: string) {
        this.url = this._base + this.path;
    };

    async save() {
        return await promises.writeFile("./src/webhook/latest.json", JSON.stringify(await this.getCurrent(), null, 2));
    };

    async getCurrent() {
        return await fetch(this.url)
            .then((res: any) => {
                return res.json();
            });
    };

    async getSaved(string?: string) {
        let saved: Buffer = await promises.readFile(string ? string : "./src/webhook/latest.json");
        // @ts-ignore
        return JSON.parse(saved);
    };

    async genColor() {
        let current: object = await this.getCurrent();
        // @ts-ignore
        switch (await current.incidents[0].status) {
            case ("resolved"):
            case ("completed"): {
                return "2096947"; // green
            }
            case ("in_progress"):
            case ("monitoring"): {
                return "15922754"; // yellow
            }
            case ("investigating"): {
                return "15571250"; // orange
            }
            case ("identified"): {
                return "15544882"; // red
            }
            case ("scheduled"):
            case ("verifying"): {
                return "4360181"; // light blue
            }
        }

    };
};
