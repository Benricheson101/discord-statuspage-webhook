# Discord Status Webhook
## What is it?
This script will send a message to your server when the [Discord status page](https://status.discordapp.com/) is updated

## Setup
1. Clone this repository
`git clone https://github.com/Benricheson101/discord-statuspage-webhook.git`
2. Install the dependencies
`npm install`
3. Compile typescript
`npm run build`
4. Setup your config (see below)
5. Make a blank json file: `latest.json` 
6. Start the script
`npm run start`

## Config
Make `config.js` and configure the following:
```js
module.exports = {
	webhook: {
		id: "",
		token: ""
	},
	content: "" // This sends a normal (non-embedded) message with the embed. Leave "" for no message
};
```
