// utils/ansi.js
// Helpers para gerar texto colorido dentro de code blocks ```ansi do Discord.
// Referência de cores suportadas pelo Discord (foreground): 30 cinza, 31 vermelho,
// 32 verde, 33 amarelo, 34 azul, 35 rosa, 36 ciano, 37 branco.

const RESET = '\u001b[0m';

const CORES = {
  cinza: 30,
  vermelho: 31,
  verde: 32,
  amarelo: 33,
  azul: 34,
  rosa: 35,
  ciano: 36,
  branco: 37,
};

/**
 * Aplica cor (e opcionalmente negrito) a um trecho de texto.
 * @param {string} texto
 * @param {keyof typeof CORES} corNome
 * @param {{ negrito?: boolean }} opts
 */
function cor(texto, corNome, { negrito = false } = {}) {
  const codigoCor = CORES[corNome] ?? CORES.branco;
  const prefixo = negrito ? `\u001b[1;${codigoCor}m` : `\u001b[0;${codigoCor}m`;
  return `${prefixo}${texto}${RESET}`;
}

/** Remove códigos ANSI de uma string (útil para calcular largura visível). */
function limparAnsi(texto) {
  return texto.replace(/\u001b\[[0-9;]*m/g, '');
}

/** Normaliza texto (minúsculas, sem acento, sem espaços nas pontas). */
function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Tenta resolver um texto livre (ex.: campo "corfavorita" digitado pelo
 * jogador) para uma das chaves válidas de CORES. Retorna null se não bater
 * com nenhuma cor suportada.
 * @param {string} nome
 * @returns {keyof typeof CORES | null}
 */
function resolverCor(nome) {
  const chave = normalizar(nome);
  return Object.prototype.hasOwnProperty.call(CORES, chave) ? chave : null;
}

// Equivalente em hex de cada cor, para usar em EmbedBuilder#setColor
// (embeds do Discord não entendem código ANSI, só hex/int).
const CORES_HEX = {
  cinza: 0x4f545c,
  vermelho: 0xed4245,
  verde: 0x57f287,
  amarelo: 0xfee75c,
  azul: 0x5865f2,
  rosa: 0xeb459e,
  ciano: 0x2bffff,
  branco: 0xffffff,
};

/**
 * Retorna o hex correspondente a uma chave de CORES (para embeds).
 * @param {keyof typeof CORES} corNome
 */
function hexDaCor(corNome) {
  return CORES_HEX[corNome] ?? CORES_HEX.branco;
}

module.exports = { cor, limparAnsi, normalizar, resolverCor, hexDaCor, RESET, CORES, CORES_HEX };
