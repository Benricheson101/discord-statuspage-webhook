# Discord Status Webhook
## What is it?
This script will send a message to your server when the [Discord status page](https://status.discordapp.com/) is updated

## Setup
1. Clone this repository
2. Install the dependencies
`npm install`
3. Compile typescript
`npm run build`
4. Setup your config (see below)
5. Make two blank json files: `src/webhook/latest.json` and `src/webhook/webhooks.json`
6. Set your OAuth2 URL in index.html
7. Start the script
`npm run start`

## Config
Make `src/config.js` and configure the following:
```js
module.exports.setup = {
	content: "The status page has been updated." // leave blank for no message
};

module.exports.oauth = {
    client_id: "",
    client_secret: "",
    grant_type: "authorization_code",
    redirect_uri: "",
    scopes: "webhook.incoming"
};
```
