const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Responde com Pong!'),
    async execute(interaction) {
        if (interaction.user.id === '282990706333581312') {
            await interaction.reply('Para de me testar e faz a recapitulação.');
            return;
        }
        await interaction.reply('Pong!');
    },
}
