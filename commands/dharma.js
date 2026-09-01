// commands/dharma.js
// /dharma ver [jogador]        -> qualquer um vê o próprio painel ou o de outro jogador
// /dharma criar handle ...     -> jogador cria seu próprio perfil
// /dharma editar jogador ...   -> SOMENTE mestre, edita qualquer campo

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPersonagem, criarPersonagem, atualizarCampo, removerPersonagem } = require('./helpers/dharmaManager');
const { montarPainel } = require('./helpers/dharmaDisplay');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dharma')
    .setDescription('Acessa o Chip Dharma')
    .addSubcommand((sub) =>
      sub
        .setName('ler')
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
          opt.setName('handle').setDescription('Seu nome').setRequired(true)
        )
        .addAttachmentOption((opt) =>
          opt.setName('avatar').setDescription('Avatar do personagem').setRequired(false)
        )
        .addStringOption((opt) =>
          opt.setName('lema').setDescription('Escreva uma frase que te defina').setRequired(false)
        )
        .addStringOption((opt) =>
          opt.setName('comidafavorita').setDescription('Qual é a sua comida favorita?').setRequired(false)
        )
        .addStringOption((opt) =>
          opt.setName('corfavorita').setDescription('Qual é a sua cor favorita?').setRequired(false)
        )
        .addStringOption((opt) =>
          opt.setName('animal').setDescription('Qual é o seu animal espiritual?').setRequired(false)
        )
        .addStringOption((opt) =>
          opt.setName('sociedade').setDescription('Organize a sociedade em uma palavra.').setRequired(false)
        )
      .addStringOption((opt) =>
          opt.setName('filosofia').setDescription('Você é um produto de suas emoções, ou as suas emoções um produto de você?').setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('editar')
        .setDescription('Edita um campo no seu perfil do MyDharma')
        .addUserOption((opt) =>
          opt.setName('jogador').setDescription('Jogador a editar').setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('campo')
            .setDescription('Campo a alterar')
            .setRequired(true)
            .addChoices(
              { name: 'Nome', value: 'handle' },
              { name: 'Lema', value: 'lema' },
              { name: 'Comida Favorita', value: 'comidafavorita' },
              { name: 'Cor Favorita', value: 'corfavorita' },
              { name: 'Animal Espiritual', value: 'animal' },
              { name: 'Sociedade', value: 'sociedade' },
              { name: 'Filosofia', value: 'filosofia' },
            )
        )
        .addStringOption((opt) =>
          opt.setName('valor').setDescription('Novo valor para o campo').setRequired(false)
        )
        .addAttachmentOption((opt) =>
            opt.setName('avatar').setDescription('Avatar do personagem').setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('deletar')
        .setDescription('Deleta o perfil do MyDharma')
        .addUserOption((opt) =>
          opt.setName('jogador').setDescription('Jogador a deletar').setRequired(true)
      )),

  async execute(interaction) {
    const subcomando = interaction.options.getSubcommand();

    switch (subcomando) {
    case 'ler': {
      const alvo = interaction.options.getUser('jogador') ?? interaction.user;
      const personagem = getPersonagem(alvo.id);
      if (!personagem) {
        await interaction.reply({
          content: `Nenhum perfil encontrado para <@${alvo.id}> no Chip Dharma. Use \`/dharma criar\´ primeiro.`,
          ephemeral: true,
          });
        }
      if (personagem){
        await interaction.reply(montarPainel(personagem));
        return;
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
        const lema = interaction.options.getString('lema') ?? 'null';
        const comidafav = interaction.options.getString('comidafavorita') ?? 'null';
        const corfav = interaction.options.getString('corfavorita') ?? 'null';
        const animal = interaction.options.getString('animal') ?? 'null';
        const sociedade = interaction.options.getString('sociedade') ?? 'null';
        const filosofia = interaction.options.getString('filosofia') ?? 'null';
        const avatar = interaction.options.getAttachment('avatar')?.url ?? null;
        
        const personagem = criarPersonagem(interaction.user.id, {
          handle,
          lema,
          comidafavorita: comidafav,
          corfavorita: corfav,
          animal: animal,
          sociedade: sociedade,
          filosofia: filosofia,
          avatar: avatar,
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
        
      const alvo = interaction.options.getUser('jogador');
      const campo = interaction.options.getString('campo');
      const valor = interaction.options.getString('valor');
      const avatar = interaction.options.getAttachment('avatar')?.url ?? null;

      let atualizado = atualizarCampo(alvo.id, campo, valor ?? null);
  
      if (avatar){
        atualizado = atualizarCampo(alvo.id, 'avatar', avatar);
      }

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

    case 'deletar': {
      const alvo = interaction.options.getUser('jogador');
      if (interaction.user.id !== alvo.id && !interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        await interaction.reply({
          content: 'Você só pode deletar o seu próprio perfil do Chip Dharma.',
          ephemeral: true,
        });
        return;
      }

      const deletado = removerPersonagem(alvo.id);
      if (!deletado) {
        await interaction.reply({
          content: 'Não foi possível deletar. Verifique se o jogador já tem um perfil criado.',
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: 'Perfil deletado com sucesso.',
        ephemeral: true,
      });
      break;
    }
    default: {
      await interaction.reply({ content: 'Subcomando inválido.', ephemeral: true });
    }
    }
  } 
} 