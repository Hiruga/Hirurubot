// utils/dharmaManager.js
// Persistência simples em JSON. Fácil de trocar depois por SQLite/Mongo/etc,
// desde que se mantenha a mesma "forma" de objeto de personagem.

const fs = require('node:fs');
const path = require('node:path');

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'characters.json');

function carregarDados() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, '{}', 'utf-8');
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function salvarDados(dados) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(dados, null, 2), 'utf-8');
}

/** @returns {object|null} personagem salvo para esse userId, ou null */
function getPersonagem(userId) {
  const dados = carregarDados();
  return dados[userId] ?? null;
}

function criarPersonagem(userId, dadosIniciais) {
  const dados = carregarDados();

  dados[userId] = {
    handle: dadosIniciais.handle ?? 'DESCONHECIDO',
    lema: dadosIniciais.lema ?? 'null',
    comidafavorita: dadosIniciais.comidafavorita ?? 'null',
    corfavorita: dadosIniciais.corfavorita ?? 'null',
    animal: dadosIniciais.animal ?? 'null',
    sociedade: dadosIniciais.sociedade ?? 'null',
    filosofia: dadosIniciais.filosofia ?? 'null',
    avatar: dadosIniciais.avatar ?? null,
  };

  salvarDados(dados);
  return dados[userId];
}

/**
 * Atualiza um campo específico do personagem.
 * campo: 'handle' | 'eddies' | 'eddies_add' | 'humanidade_atual' |
 *        'humanidade_max' | 'vida_atual' | 'vida_max'
 */
function atualizarCampo(userId, campo, valor, avatar = null) {
  const dados = carregarDados();
  if (!dados[userId]) return null;

  switch (campo) {
    case 'handle':
      dados[userId].handle = String(valor);
      break;
    case 'lema':
      dados[userId].lema = String(valor);
      break;
    case 'comidafavorita':
      dados[userId].comidafavorita = String(valor);
      break;
    case 'corfavorita':
      dados[userId].corfavorita = String(valor);
      break;
    case 'animal':
      dados[userId].animal = String(valor);
      break;
    case 'sociedade':
      dados[userId].sociedade = String(valor);
      break;
    case 'filosofia':
      dados[userId].filosofia = String(valor);
      break;
    default:
      return null;
  }
  if (avatar) {
    dados[userId].avatar = avatar;
  }

  salvarDados(dados);
  return dados[userId];
}

function removerPersonagem(userId) {
  const dados = carregarDados();
  if (!dados[userId]) return false;
  delete dados[userId];
  salvarDados(dados);
  return true;
}

module.exports = {
  getPersonagem,
  criarPersonagem,
  atualizarCampo,
  removerPersonagem,
  carregarDados,
};
