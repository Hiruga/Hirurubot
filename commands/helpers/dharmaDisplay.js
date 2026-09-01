// utils/dharmaDisplay.js
// Monta a "tela" do app do Chip Dharma como texto para um code block ```ansi.

const { EmbedBuilder } = require('discord.js');
const { cor, limparAnsi, resolverCor, hexDaCor } = require('./ansi');

const LARGURA = 34; // largura interna útil da caixa (em caracteres)

function preencherLinha(texto) {
  const tamanhoVisivel = limparAnsi(texto).length;
  const espacos = Math.max(LARGURA - tamanhoVisivel, 0);
  return `║ ${texto}${' '.repeat(espacos)} ║`;
}

/** Quebra um texto simples (sem códigos ANSI) em linhas de até `largura` chars. */
function quebrarTexto(texto, largura) {
  const palavras = String(texto ?? '').split(/\s+/).filter(Boolean);
  const linhas = [];
  let atual = '';

  for (const palavra of palavras) {
    const candidato = atual ? `${atual} ${palavra}` : palavra;

    if (candidato.length > largura) {
      if (atual) linhas.push(atual);

      if (palavra.length > largura) {
        // palavra sozinha maior que a largura disponível: quebra forçada
        let resto = palavra;
        while (resto.length > largura) {
          linhas.push(resto.slice(0, largura));
          resto = resto.slice(largura);
        }
        atual = resto;
      } else {
        atual = palavra;
      }
    } else {
      atual = candidato;
    }
  }

  if (atual) linhas.push(atual);
  return linhas.length ? linhas : [''];
}

/**
 * Monta uma ou mais linhas da caixa para um campo "RÓTULO: valor",
 * quebrando o valor automaticamente quando não cabe na largura da caixa.
 */
function linhaCampo(rotulo, valor, { corTexto = 'branco', corRotulo = 'branco', negritoTexto = false } = {}) {
  const prefixo = `${rotulo}: `;
  const larguraDisponivel = Math.max(LARGURA - prefixo.length, 8);
  const linhasTexto = quebrarTexto(valor && valor !== 'null' ? valor : '—', larguraDisponivel);

  return linhasTexto.map((linha, indice) => {
    if (indice === 0) {
      return preencherLinha(`${cor(prefixo, corRotulo, { negrito: true })}${cor(linha, corTexto, { negrito: negritoTexto })}`);
    }
    return preencherLinha(`${' '.repeat(prefixo.length)}${cor(linha, corTexto, { negrito: negritoTexto })}`);
  });
}

function montarPainel(personagem) {
  const {
    handle,
    lema,
    comidafavorita,
    corfavorita,
    animal,
    sociedade,
    filosofia,
  } = personagem;

  // Se o jogador escreveu o nome de uma cor suportada (ex.: "verde", "azul"),
  // o próprio campo COR FAV é exibido nessa cor.
  const corDaCorFavorita = resolverCor(corfavorita) ?? 'branco';

  const linhas = [
    `╔${'═'.repeat(LARGURA + 2)}╗`,
    preencherLinha(cor('CHIP DHARMA — v0.6.7', 'ciano', { negrito: true })),
    preencherLinha(cor('ACESSANDO PERFIL...', 'cinza')),
    `╠${'═'.repeat(LARGURA + 2)}╣`,
    ...linhaCampo('HANDLE', handle, { corTexto: 'ciano', negritoTexto: true }),
    ...linhaCampo('LEMA', lema),
    ...linhaCampo('COMIDA', comidafavorita),
    ...linhaCampo('COR FAV', corfavorita, { corTexto: corDaCorFavorita }),
    ...linhaCampo('ANIMAL', animal),
    ...linhaCampo('SOCIEDADE', sociedade),
    ...linhaCampo('FILOSOFIA', filosofia),
    `╚${'═'.repeat(LARGURA + 2)}╝`,
  ];

  const conteudo = '```ansi\n' + linhas.join('\n') + '\n```';

  if (!personagem.avatar) {
    return { content: conteudo };
  }

  const embed = new EmbedBuilder()
    .setColor(hexDaCor(corDaCorFavorita))
    .setThumbnail(personagem.avatar);

  return { content: conteudo, embeds: [embed] };
}

module.exports = { montarPainel };
