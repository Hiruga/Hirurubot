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

module.exports = { cor, limparAnsi, RESET, CORES };
