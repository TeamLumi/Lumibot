# Lumibot

Discord bot for the Luminescent Platinum ROM Hack. Including a custom Luminescent Platinum Pokedex with all of our changes.

» Help command **/help**

» Pokedex command **/pokedex**

## How to get started


```
$ git clone
$ npm install
$ npm start
```

## Config.json

```
{
	"prefix": "!", // Depreciated so use whatever.
	"token_dev": "", // Token from the dev bot.
	"token_prod": "", // Token from the prod bot. You should never need to use this.
	"owner": "", // Copy your own User ID here.
	"client_id_dev": "", //User ID of the dev bot.
	"client_id_prod": "", //User ID fo the prod bot.
	"test_guild_id": "", // ID of guild where you test commands.
	"botChannelProd": "", // ID of the dedicated bot channel in prod.
	"botChannelDev": "" // ID of the dedicated bot channel in dev.
}
```

## Plugin Setup

Install the extension/plugin for your favorite IDE (VSCode, JetBrains, NVIM, ...).

VSCode is the best!

1. [EditorConfig](https://editorconfig.org/) - EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs.
2. [Prettier](https://prettier.io/) - An opinionated code formatter

## How to format every file with prettier

```
npx prettier --write .
```
