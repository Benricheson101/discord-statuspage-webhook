import {readFile, writeFileSync, readFileSync} from "fs";

export default class List {
    data?: object;
    path?: string;

    constructor(path?: string, data?: any) {
        this.path = path || "./webhooks.json";
        this.data = data;
    };

    save() {
        readFile(this.path, (err: Error, data: any) => {
            if (err) throw err;
            let json: object = JSON.parse(data);

            if (!this.data) return;

            // @ts-ignore
            let {id, token, guild_id} = this.data;
            let newHook = {
                id: id,
                token: token,
                guild_id: guild_id
            };
            json["webhooks"].push(newHook);

            writeFileSync(this.path, JSON.stringify(json, null, 2));
        });

    }

    delete(id: string) {
        let saved: object[] = this.getSaved;
        let removed = saved.filter((obj: any) => obj.id !== id);
        if (removed === saved) return;
        console.log(removed);
        let json = {
            webhooks: removed
        };
        writeFileSync(this.path, JSON.stringify(json, null, 2));
    }

    get getSaved() {
        let saved: string = readFileSync(this.path, "utf8");
        return (JSON.parse(saved)).webhooks;
    }
}
