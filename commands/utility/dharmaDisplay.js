// utils/dharmaDisplay.js
// Monta a "tela" do app do Chip Dharma como texto para um code block ```ansi.

const { cor, limparAnsi } = require('./ansi');

const LARGURA = 34; // largura interna útil da caixa (em caracteres)

function preencherLinha(texto) {
  const tamanhoVisivel = limparAnsi(texto).length;
  const espacos = Math.max(LARGURA - tamanhoVisivel, 0);
  return `║ ${texto}${' '.repeat(espacos)} ║`;
}

function barraDe(atual, max, tamanho = 10) {
  const proporcao = max > 0 ? Math.max(0, Math.min(1, atual / max)) : 0;
  const preenchido = Math.round(proporcao * tamanho);
  return '█'.repeat(preenchido) + '░'.repeat(tamanho - preenchido);
}

// Verde saudável, amarelo em alerta, vermelho crítico — dá pro jogador
// sentir o personagem "quebrando" conforme perde humanidade/vida.
function corPorProporcao(atual, max) {
  const proporcao = max > 0 ? atual / max : 0;
  if (proporcao > 0.7) return 'verde';
  if (proporcao > 0.35) return 'amarelo';
  return 'vermelho';
}

function montarPainel(personagem) {
  const { handle, eddies, humanidade, vida } = personagem;

  const corHumanidade = corPorProporcao(humanidade.atual, humanidade.max);
  const corVida = corPorProporcao(vida.atual, vida.max);

  const linhas = [
    `╔${'═'.repeat(LARGURA + 2)}╗`,
    preencherLinha(cor('CHIP DHARMA — v2.1.7', 'ciano', { negrito: true })),
    preencherLinha(cor('ACESSANDO PERFIL...', 'cinza')),
    `╠${'═'.repeat(LARGURA + 2)}╣`,
    preencherLinha(`HANDLE: ${cor(handle, 'ciano', { negrito: true })}`),
    preencherLinha(`EDDIES: ${cor('¤ ' + eddies.toLocaleString('pt-BR'), 'amarelo')}`),
    preencherLinha(
      `HUMAN.: ${cor(barraDe(humanidade.atual, humanidade.max), corHumanidade)} ${humanidade.atual}/${humanidade.max}`
    ),
    preencherLinha(
      `VIDA..: ${cor(barraDe(vida.atual, vida.max), corVida)} ${vida.atual}/${vida.max}`
    ),
    `╚${'═'.repeat(LARGURA + 2)}╝`,
  ];

  return '```ansi\n' + linhas.join('\n') + '\n```';
}

module.exports = { montarPainel };
