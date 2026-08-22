require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once("clientReady", () => {
    console.log(`Uma IA atravessou a barreira negra: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if(message.author.bot) return;

    if(message.content === "!ping"){
        message.reply("pong");
    }
    if(message.content === "!lesado"){
        message.reply("Eu não sou lesado Penas >:[");
    }
});

client.login(process.env.DISCORD_TOKEN);