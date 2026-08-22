const {SlashCommandBuilder} = require("discord.js");

module.exports = {    data: new SlashCommandBuilder().setName('server').setDescription('Responde com informações sobre o servidor!'),
    async execute(interaction) {
        await interaction.reply(
            `Este servidor se chama: ${interaction.guild.name} e foi criado em: ${interaction.guild.createdAt}.`
        )
    },
}