const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('user').setDescription('Responde com informações do usuário!'),
    async execute(interaction) {
        await interaction.reply(`Seu nome de usuário é: ${interaction.user.username} e você se juntou ao servidor em: ${interaction.member.joinedAt}.`,)
        },
}