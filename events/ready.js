const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Uma unidade Dharma está online: ${client.user.tag}`);
    },
};