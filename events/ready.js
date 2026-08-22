const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Uma IA atravessou a barreira negra: ${client.user.tag}`);
    },
};