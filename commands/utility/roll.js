const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('roll').setDescription('Rola um dado de X lados!'),
    async execute(interaction) {
        function roll(max) {
            return Math.floor(Math.random() * max);
            }
        await interaction.reply(`Você rolou um ${roll(21)}`);
    }
}
/*let result = 0;

while (result !== 20) {
    result = roll(21);
    if (result === 0) {
        result = roll(21);
    }
    console.log(`Você rodou um ${result}`);
} 
result = roll(21);
console.log(`Você rodou um ${result}`);*/