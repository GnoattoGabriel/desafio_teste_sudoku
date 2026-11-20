'use strict';

// Casos de teste executaveis correspondentes a casos_de_teste_sudoku_binario.docx.
// A implementacao de src/validarGradeBinaria.js deve ser produzida a partir
// da especificacao em .docx. Enquanto ela nao existe, os testes falham com
// mensagem clara (estado RED esperado do desafio).

const test = require('node:test');
const assert = require('node:assert/strict');

let validarGradeBinaria;
try {
  validarGradeBinaria = require('../src/validarGradeBinaria').validarGradeBinaria;
} catch (erro) {
  const detalhe = (erro && (erro.stack || erro.message)) || String(erro);
  validarGradeBinaria = () => {
    throw new Error(
      'Crie src/validarGradeBinaria.js exportando validarGradeBinaria. ' + detalhe
    );
  };
}
if (typeof validarGradeBinaria !== 'function') {
  validarGradeBinaria = () => {
    throw new Error('Exporte validarGradeBinaria de src/validarGradeBinaria.js');
  };
}

const copia = (grade) => grade.map((linha) => [...linha]);

// Copia generica: preserva NaN, undefined e qualquer tipo de entrada.
const clonar = (v) => {
  if (Array.isArray(v)) return v.map(clonar);
  if (v && typeof v === 'object') {
    const out = {};
    for (const chave of Object.keys(v)) out[chave] = clonar(v[chave]);
    return out;
  }
  return v;
};

// Grade de referencia — CT-01
const BASE = [
  [1, 1, 0, 1, 0, 0],
  [1, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 1],
  [0, 0, 1, 0, 1, 1],
];

// Segunda grade valida, nao simetrica — CT-13
const SEGUNDA = [
  [1, 0, 1, 0, 1, 0],
  [0, 1, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1],
  [0, 1, 0, 1, 0, 1],
];

const comCelula = (grade, linha, coluna, valor) => {
  const g = copia(grade);
  g[linha][coluna] = valor;
  return g;
};

const verifica = (id, descricao, entrada, esperado) => {
  test(`${id} — ${descricao}`, () => {
    const antes = clonar(entrada);
    assert.equal(validarGradeBinaria(entrada), esperado, `${id}: ${descricao}`);
    assert.deepEqual(entrada, antes, `${id}: a entrada nao pode ser alterada`);
  });
};

verifica('CT-01', 'grade completa e correta', copia(BASE), true);

verifica('CT-02', 'celula com valor 2', [
  [1, 1, 0, 1, 0, 0],
  [0, 1, 1, 0, 1, 0],
  [0, 0, 1, 1, 0, 1],
  [2, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1],
  [0, 0, 1, 0, 1, 1],
], false);

verifica('CT-03', 'celula vazia (null)', comCelula(BASE, 0, 0, null), false);

const ct04 = comCelula(BASE, 0, 4, 1);
verifica('CT-04', 'linha com quatro 1', ct04, false);

verifica('CT-05', 'coluna com quatro 0', comCelula(BASE, 0, 1, 0), false);

verifica('CT-06', 'tres iguais consecutivos na linha', [
  [1, 1, 1, 0, 0, 0],
  [1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1],
  [0, 1, 0, 1, 1, 0],
  [1, 0, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 1],
], false);

verifica('CT-07', 'tres iguais consecutivos na coluna', [
  [1, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 0, 0],
  [1, 0, 1, 0, 0, 1],
  [0, 1, 0, 1, 1, 0],
  [0, 1, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 1],
], false);

verifica('CT-08', 'duas linhas iguais', [
  [1, 1, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 0],
  [0, 0, 1, 1, 0, 1],
  [0, 1, 0, 0, 1, 1],
  [1, 1, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 1],
], false);

verifica('CT-09', 'duas colunas iguais', [
  [1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1],
  [0, 0, 1, 1, 0, 1],
], false);

verifica('CT-10', 'grade 5x6', copia(BASE).slice(0, 5), false);
verifica('CT-11', 'celula com texto "1"', comCelula(BASE, 0, 0, '1'), false);
verifica('CT-12', 'parametro null', null, false);

verifica('CT-13', 'segunda grade valida e nao simetrica', copia(SEGUNDA), true);
verifica('CT-14', 'valor 2 na segunda grade', comCelula(SEGUNDA, 0, 0, 2), false);

const ct15 = copia(BASE);
ct15[0] = [1, 1, 0, 1, 0];
verifica('CT-15', 'linha com 5 celulas', ct15, false);

const ct16 = copia(BASE);
ct16[0] = [1, 1, 0, 1, 0, 0, 0];
verifica('CT-16', 'linha com 7 celulas', ct16, false);

verifica('CT-17', 'entrada que nao e matriz', '110100', false);

verifica('CT-18', 'celulas booleanas', comCelula(comCelula(BASE, 0, 0, true), 0, 1, false), false);
verifica('CT-19', 'celula com NaN', comCelula(BASE, 0, 0, NaN), false);
verifica('CT-20', 'celula com undefined', comCelula(BASE, 0, 0, undefined), false);

test('CT-21 — a funcao nao altera a grade recebida', () => {
  const entrada = copia(BASE);
  const antes = copia(entrada);
  assert.equal(validarGradeBinaria(entrada), true, 'CT-21: retorno esperado true');
  assert.deepEqual(entrada, antes, 'CT-21: a grade nao pode ser alterada');
});

verifica('CT-22', 'celula com valor negativo', comCelula(BASE, 0, 0, -1), false);
verifica('CT-23', 'celula com valor decimal', comCelula(BASE, 0, 0, 0.5), false);

const ct24 = copia(BASE);
ct24.push([0, 1, 1, 0, 1, 0]);
verifica('CT-24', 'matriz com sete linhas', ct24, false);

test('CT-25 — entradas que nao sao matrizes', () => {
  for (const entrada of [42, {}, true]) {
    const antes = clonar(entrada);
    assert.equal(validarGradeBinaria(entrada), false,
      `CT-25: entrada ${JSON.stringify(entrada)} deve ser rejeitada`);
    assert.deepEqual(entrada, antes, 'CT-25: a entrada nao pode ser alterada');
  }
});

const ct26 = copia(BASE);
ct26[0] = '110100';
verifica('CT-26', 'linha representada como texto', ct26, false);

const ct27 = copia(BASE);
for (const [l, c] of [[0, 0], [2, 3], [4, 5], [5, 1]]) {
  ct27[l][c] = null;
}
verifica('CT-27', 'varias celulas vazias', ct27, false);

// Tripla de 1 no meio da linha 1 (isolada: so a regra de triplas e violada).
verifica('CT-28', 'tres 1 consecutivos no meio de uma linha', [
  [0, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 1, 1],
  [1, 0, 0, 1, 0, 1],
  [0, 1, 0, 1, 1, 0],
  [1, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 1, 0],
], false);

// Tripla de 0 no meio da coluna 1 (isolada: so a regra de triplas e violada).
verifica('CT-29', 'tres 0 consecutivos no meio de uma coluna', [
  [1, 0, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 1],
  [0, 1, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [1, 1, 0, 1, 0, 0],
], false);

// CT-30 a CT-33 — grades validas adicionais, distintas das duas referencias.
verifica('CT-30', 'terceira grade valida, com padrao diferente das duas referencias', [
    [1, 1, 0, 1, 0, 0],
    [0, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1],
    [0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 1]
  ], true);

verifica('CT-31', 'quarta grade valida, com ordem de linhas diferente', [
    [1, 1, 0, 1, 0, 0],
    [0, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1],
    [0, 1, 0, 1, 1, 0],
    [0, 0, 1, 0, 1, 1],
    [1, 0, 0, 1, 0, 1]
  ], true);

verifica('CT-32', 'quinta grade valida, com padrao diferente das duas referencias', [
    [1, 1, 0, 1, 0, 0],
    [0, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0],
    [0, 0, 1, 0, 1, 1]
  ], true);

verifica('CT-33', 'sexta grade valida, com padrao diferente das duas referencias', [
    [1, 1, 0, 1, 0, 0],
    [0, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0],
    [1, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 1, 1]
  ], true);

// CT-34 — enumeracao deterministica de 120 grades validas (sem Math.random).
const PADROES_LINHA = (() => {
  const r = [];
  for (let m = 0; m < 64; m++) {
    const linha = Array.from({ length: 6 }, (_, i) => (m >> i) & 1);
    const tresUns = linha.filter((x) => x === 1).length === 3;
    const semTripla = !linha.some((x, i) => i >= 2 && x === linha[i - 1] && x === linha[i - 2]);
    if (tresUns && semTripla) r.push(linha);
  }
  return r;
})();

const colunasDa = (g) => Array.from({ length: 6 }, (_, c) => g.map((linha) => linha[c]));
const temTripla = (seq) => seq.some((x, i) => i >= 2 && x === seq[i - 1] && x === seq[i - 2]);
const ehValida = (g) =>
  g.length === 6 &&
  g.every((linha) => linha.length === 6 && linha.filter((x) => x === 1).length === 3) &&
  colunasDa(g).every((coluna) => coluna.filter((x) => x === 1).length === 3) &&
  !g.some(temTripla) && !colunasDa(g).some(temTripla) &&
  new Set(g.map((linha) => linha.join(''))).size === 6 &&
  new Set(colunasDa(g).map((coluna) => coluna.join(''))).size === 6;

const gerarGradesValidas = (limite) => {
  const todas = [];
  const escolher = (linhas) => {
    if (todas.length >= limite) return;
    if (linhas.length === 6) {
      if (ehValida(linhas)) todas.push(linhas);
      return;
    }
    for (const padrao of PADROES_LINHA) {
      escolher([...linhas, padrao]);
      if (todas.length >= limite) return;
    }
  };
  escolher([]);
  return todas;
};

test('CT-34 — 120 grades validas geradas deterministicamente', () => {
  const grades = gerarGradesValidas(120);
  assert.equal(grades.length, 120, 'CT-34: o gerador deve produzir 120 grades');
  for (const [i, grade] of grades.entries()) {
    const antes = clonar(grade);
    assert.equal(validarGradeBinaria(grade), true, `CT-34: grade ${i + 1} deve ser valida`);
    assert.deepEqual(grade, antes, `CT-34: grade ${i + 1} nao pode ser alterada`);
  }
});
