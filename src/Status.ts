import * as fetch from "node-fetch";
import {promises} from "fs";

export default class Status {
    private _base = "https://status.discordapp.com";
    readonly url: string;

    constructor(private path: string) {
        this.url = this._base + this.path;
    };

    async save() {
        return await promises.writeFile("./latest.json", JSON.stringify(await this.getCurrent(), null, 2));
    };

    async getCurrent() {
        return await fetch(this.url)
            .then((res) => {
                return res.json();
            });
    };

    async getSaved(filePath?: string) {
        let saved = await promises.readFile(filePath ? filePath : "./latest.json");
        // @ts-ignore
        return JSON.parse(saved);
    };

    async genColor() {
        let current = await this.getCurrent();
        switch (await current.status.indicator) {
            case ("none"): {
                return "2096947";
            }
            case ("minor"): {
                return "15922754";
            }
            case ("major"): {
                return "15571250";
            }
            case ("critical"): {
                return "15544882";
            }
            case ("maintenance"): {
                return "4360181";
            }
        }

    }
};
