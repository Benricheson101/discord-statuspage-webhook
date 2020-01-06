import {readFile} from "fs";
import {IncomingMessage, ServerResponse} from "http";

export const router = {
    checkRoute(url: string, req: IncomingMessage, res: ServerResponse) {
        switch (url) {
            case ("/"): {
                readFile("src/web/pages/index.html", ((err: Error, data: Buffer) => {
                    if (err) throw err;
                    res.end(data);
                }));
                break;
            }
            case ("/authorized"): {
                readFile("src/web/pages/authorized.html", ((err: Error, data: Buffer) => {
                    if (err) throw err;
                    res.end(data);
                }));
                break;
            }
            case ("/login"): {
                readFile("src/web/pages/login.html", ((err: Error, data: Buffer) => {
                    if (err) throw err;
                    res.end(data);
                }));
                break;
            }
            default: {
                res.end("An error occurred.");
            }
        }
    }
};
