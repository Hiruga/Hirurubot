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
        option.setChoices(
            { name: 'd4', value: 4 },
            { name: 'd6', value: 6 },
            { name: 'd8', value: 8 },
            { name: 'd10', value: 10 },
            { name: 'd12', value: 12 },
            { name: 'd20', value: 20 },
        )
        .setName('lados')
        .setDescription('O número de lados que o dado terá')
        .setRequired(true))
    .addStringOption(option =>
        option.setChoices(
            { name: '+', value: '+' },
            { name: '-', value: '-' },
            { name: '*', value: '*' },
            { name: '/', value: '/' },
        )
        .setName('operacao')
        .setDescription('Operação matemática atribuida à rolagem')
        .setRequired(false))
    .addIntegerOption(option =>
        option.setName('valor')
        .setDescription('Valor usado na operação')
        .setRequired(false)),

    async execute(interaction) {
        const op = interaction.options.getString('operacao');
        const val = interaction.options.getInteger('valor');
        const quant = interaction.options.getInteger('quant');
        const lados = interaction.options.getInteger('lados');
        let resultF;
        const roll = (max) => Math.floor(Math.random() * max) +1;

        const resultados = [];
        for (let i = 0; i < quant; i++){
            resultados.push(roll(lados));
        }

        let resLen = resultados.length;
        let somaD = 0;
        for (let i = 0; i < resLen; i++){
           somaD = somaD + resultados[i];
        }

        if(op != null){
            switch(op){
                case '+':
                    resultF = somaD + val;
                    break;
                case '-':
                    resultF = somaD - val;
                    break;
                case '*':
                    resultF = somaD * val;
                    break;
                case '/':
                    resultF = somaD / val;
                    break;
            }
        }
        
        let text;
        if(op != null && val != null){
            text = '``'+resultF+'`` <- ['+resultados.join(', ')+'] '+quant+'d'+lados+' '+op+' '+val+'.';
        } else {
                text = '``'+somaD+'`` <- ['+resultados.join(', ')+'] '+quant+'d'+lados+'.';
            }
        await interaction.reply(
            `${text}`)
    }
}