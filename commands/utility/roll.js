const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rola X dado(s) de Y lados!')
    .addIntegerOption(option => 
      option
        .setName('quant')
        .setDescription('O número de dados que você quer rolar ')
        .setRequired(true))
    .addIntegerOption(option => 
        option.setAutocomplete(true)
        .setName('lados')
        .setDescription('O número de lados que o dado terá')
        .setRequired(true)),

    async execute(interaction) {
        const quant = interaction.options.getInteger('quant');
        const lados = interaction.options.getInteger('lados');

        const roll = (max) => Math.floor(Math.random() * max) +1;

        const resultados = [];
        for (let i = 0; i < quant; i++){
            resultados.push(roll(lados));
        }
           
        await interaction.reply(
            `Você rodou ${quant}d${lados}: [${resultados.join(', ')}]`);
    }
}