// commands/dharma.js
// /dharma ver [jogador]        -> qualquer um vê o próprio painel ou o de outro jogador
// /dharma criar handle ...     -> jogador cria seu próprio perfil
// /dharma editar jogador ...   -> SOMENTE mestre, edita qualquer campo

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPersonagem, criarPersonagem, atualizarCampo } = require('./utility/dharmaManager');
const { montarPainel } = require('./utility/dharmaDisplay');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dharma')
    .setDescription('Acessa o Chip Dharma')
    .addSubcommand((sub) =>
      sub
        .setName('ver')
        .setDescription('Exibe o painel do Chip Dharma')
        .addUserOption((opt) =>
          opt
            .setName('jogador')
            .setDescription('Ver o chip de outro jogador (padrão: você mesmo)')
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('criar')
        .setDescription('Cria seu perfil no Chip Dharma')
        .addStringOption((opt) =>
          opt.setName('handle').setDescription('Seu handle/apelido').setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt.setName('eddies').setDescription('Eurodólares iniciais').setRequired(false)
        )
        .addIntegerOption((opt) =>
          opt.setName('humanidade').setDescription('Humanidade inicial (e máxima)').setRequired(false)
        )
        .addIntegerOption((opt) =>
          opt.setName('vida').setDescription('Vida inicial (e máxima)').setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('editar')
        .setDescription('[Mestre] Edita um campo do Chip Dharma de um jogador')
        .addUserOption((opt) =>
          opt.setName('jogador').setDescription('Jogador a editar').setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('campo')
            .setDescription('Campo a alterar')
            .setRequired(true)
            .addChoices(
              { name: 'Handle', value: 'handle' },
              { name: 'Eddies (definir valor)', value: 'eddies' },
              { name: 'Eddies (somar/subtrair)', value: 'eddies_add' },
              { name: 'Humanidade atual', value: 'humanidade_atual' },
              { name: 'Humanidade máxima', value: 'humanidade_max' },
              { name: 'Vida atual', value: 'vida_atual' },
              { name: 'Vida máxima', value: 'vida_max' }
            )
        )
        .addStringOption((opt) =>
          opt.setName('valor').setDescription('Novo valor (use negativo para eddies_add subtrair)').setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcomando = interaction.options.getSubcommand();

    const alvo = interaction.options.getUser('jogador') ?? interaction.user;
    
    switch (subcomando) {
    case 'ver': {
      const personagem = getPersonagem(alvo.id);
      if (!personagem) {
        await interaction.reply({
          content: `Nenhum perfil encontrado para <@${alvo.id}> no Chip Dharma. Use \`/dharma criar\´ primeiro.`,
          ephemeral: true,
          });
        }
      break;
    }

    case 'criar': {
      if (getPersonagem(interaction.user.id)) {
        await interaction.reply({
          content: 'Você já tem um perfil no MyDharma. Edite com `/dharma editar`.',
          ephemeral: true,
        });
        return;
        }
        
        const handle = interaction.options.getString('handle');
        const eddies = interaction.options.getInteger('eddies') ?? 0;
        const humanidade = interaction.options.getInteger('humanidade') ?? 50;
        const vida = interaction.options.getInteger('vida') ?? 40;
        
        const personagem = criarPersonagem(interaction.user.id, {
          handle,
          eddies,
          humanidadeAtual: humanidade,
          humanidadeMax: humanidade,
          vidaAtual: vida,
          vidaMax: vida,
          });
          
          await interaction.reply(montarPainel(personagem));
          return;
        break;
    }
        
    case 'editar': {
      //const ehMestre = interaction.memberPermissions?.has(PermissionsFlagBits.ManageGuild);
      
      /*if(!ehMestre) {
      await interaction.reply({
        content: 'Apenas o mestre pode editar o Chip Dharma de outros jogadores.',
        ephemeral: true,
        });
        return;
        }*/
        
      alvo = interaction.options.getUser('jogador');
      const campo = interaction.options.getString('campo');
      const valor = interaction.options.getString('valor');
      
      const atualizado = atualizarCampo(alvo.id, campo, valor);
      
      if(!atualizado) {
        await interaction.reply({
          content: 'Não foi possível atualizar. Verifique se o jogador já tem um perfil criado.',
          ephemeral: true,
          });
        return;
      }
      
      await interaction.reply(montarPainel(atualizado));
    break;
    }
  
    default: {
      await interaction.reply({ content: 'Subcomando inválido.', ephemeral: true });
    }
    }
  } 
} 