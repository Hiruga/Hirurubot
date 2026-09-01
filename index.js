const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandEntries = fs.readdirSync(foldersPath, { withFileTypes: true });

for (const entry of commandEntries) {
    const fullPath = path.join(foldersPath, entry.name);

    if (entry.isDirectory()) {
        if (entry.name === 'utility') continue;

        const commandFiles = fs.readdirSync(fullPath)
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(fullPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[AVISO] O comando em ${filePath} está com "data" ou "execute" ausentes.`);
            }
        }
        continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;

    const command = require(fullPath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[AVISO] O comando em ${fullPath} está com "data" ou "execute" ausentes.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
client.login(token);