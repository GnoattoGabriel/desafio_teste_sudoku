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

let criarPartida, preencher, status, resolver, dica;
try {
  ({ criarPartida, preencher, status, resolver, dica } =
    require('../src/validarGradeBinaria'));
} catch (erro) {
  const detalhe = (erro && (erro.stack || erro.message)) || String(erro);
  const indisponivel = (nome) => () => {
    throw new Error('Exporte ' + nome + ' de src/validarGradeBinaria.js. ' + detalhe);
  };
  criarPartida = indisponivel('criarPartida');
  preencher = indisponivel('preencher');
  status = indisponivel('status');
  resolver = indisponivel('resolver');
  dica = indisponivel('dica');
}
for (const [nome, funcao] of Object.entries({
  criarPartida, preencher, status, resolver, dica
})) {
  if (typeof funcao !== 'function') {
    const mensagem = 'Exporte ' + nome + ' de src/validarGradeBinaria.js';
    if (nome === 'criarPartida') criarPartida = () => { throw new Error(mensagem); };
    if (nome === 'preencher') preencher = () => { throw new Error(mensagem); };
    if (nome === 'status') status = () => { throw new Error(mensagem); };
    if (nome === 'resolver') resolver = () => { throw new Error(mensagem); };
    if (nome === 'dica') dica = () => { throw new Error(mensagem); };
  }
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

// opcoes.funcao troca a funcao testada; opcoes.deep compara o retorno inteiro;
// opcoes.apos permite conferir propriedades do retorno. A entrada sempre e
// clonada antes da chamada e comparada depois, em todos os casos.
const verifica = (id, descricao, entrada, esperado, opcoes = {}) => {
  test(`${id} — ${descricao}`, () => {
    const antes = clonar(entrada);
    const funcao = opcoes.funcao || validarGradeBinaria;
    const saida = funcao(entrada);
    if (esperado !== undefined) {
      const previsto = typeof esperado === 'function' ? esperado(entrada) : esperado;
      if (opcoes.deep) {
        assert.deepEqual(saida, previsto, `${id}: retorno`);
      } else {
        assert.equal(saida, previsto, `${id}: ${descricao}`);
      }
    }
    assert.deepEqual(entrada, antes, `${id}: a entrada nao pode ser alterada`);
    if (opcoes.apos) opcoes.apos(saida);
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


// -------------------------------------------------------------------------
// Extensao aditiva do plano: enumerated property tests, transformacoes,
// mutacoes e camada de puzzle (CT-35 a CT-45). CT-01 a CT-34 preservados.
// -------------------------------------------------------------------------

// Enumera todas as grades que respeitam dominio, contagem e triplas.
// Com distintas = false, exclui as que repetem linha ou coluna (regra 4).
const enumerarGrades = (distintas) => {
  const resultado = [];
  const uns = Array(6).fill(0);
  const historico = Array.from({ length: 6 }, () => []);
  const linhas = [];
  const usadas = new Set();
  const voltar = () => {
    if (linhas.length === 6) {
      if (distintas) {
        const cols = colunasDa(linhas).map((c) => c.join(''));
        if (new Set(cols).size !== 6) return;
      }
      resultado.push(linhas.map((linha) => [...linha]));
      return;
    }
    const altura = linhas.length;
    for (const padrao of PADROES_LINHA) {
      const chave = padrao.join('');
      if (distintas && usadas.has(chave)) continue;
      let cabe = true;
      for (let c = 0; c < 6; c++) {
        const v = padrao[c];
        if (uns[c] + v > 3 || (altura - uns[c]) + (1 - v) > 3) { cabe = false; break; }
        const h = historico[c];
        if (h.length >= 2 && h[h.length - 1] === v && h[h.length - 2] === v) { cabe = false; break; }
      }
      if (!cabe) continue;
      usadas.add(chave);
      linhas.push(padrao);
      for (let c = 0; c < 6; c++) { uns[c] += padrao[c]; historico[c].push(padrao[c]); }
      voltar();
      for (let c = 0; c < 6; c++) { uns[c] -= padrao[c]; historico[c].pop(); }
      linhas.pop();
      usadas.delete(chave);
    }
  };
  voltar();
  return resultado;
};

const TODAS_AS_GRADES = enumerarGrades(false);
const GRADES_DISTINTAS = enumerarGrades(true);

test('CT-35 - todas as 4140 grades validas com a regra 4', () => {
  assert.equal(GRADES_DISTINTAS.length, 4140, 'CT-35: quantidade de grades');
  for (const [i, grade] of GRADES_DISTINTAS.entries()) {
    const antes = clonar(grade);
    assert.equal(validarGradeBinaria(grade), true,
      `CT-35: grade ${i + 1} deve ser valida`);
    assert.deepEqual(grade, antes, `CT-35: grade ${i + 1} nao pode ser alterada`);
  }
});

test('CT-36 - todas as 11222 grades, com e sem a regra 4', () => {
  assert.equal(TODAS_AS_GRADES.length, 11222, 'CT-36: quantidade de grades');
  let aceitas = 0;
  let recusadas = 0;
  for (const [i, grade] of TODAS_AS_GRADES.entries()) {
    const antes = clonar(grade);
    const previsto = ehValida(grade);
    assert.equal(validarGradeBinaria(grade), previsto,
      `CT-36: grade ${i + 1} (linhas/colunas distintas: ${previsto})`);
    assert.deepEqual(grade, antes, `CT-36: grade ${i + 1} nao pode ser alterada`);
    if (previsto) aceitas++; else recusadas++;
  }
  assert.equal(aceitas, 4140, 'CT-36: 4140 com linhas e colunas distintas');
  assert.equal(recusadas, 7082, 'CT-36: 7082 violam a regra 4');
});

const transpor = (g) => Array.from({ length: 6 }, (_, c) => g.map((linha) => linha[c]));
const complementar = (g) => g.map((linha) => linha.map((v) => 1 - v));
const permutarLinhas = (g, ordem) => ordem.map((i) => [...g[i]]);
const permutarColunas = (g, ordem) => g.map((linha) => ordem.map((i) => linha[i]));
const transformacoes = (g) => [
  ['complemento 0/1', complementar(g)],
  ['linhas invertidas', permutarLinhas(g, [5, 4, 3, 2, 1, 0])],
  ['linhas rotacionadas', permutarLinhas(g, [2, 3, 4, 5, 0, 1])],
  ['colunas invertidas', permutarColunas(g, [5, 4, 3, 2, 1, 0])],
  ['colunas rotacionadas', permutarColunas(g, [3, 4, 5, 0, 1, 2])],
  ['transposicao', transpor(g)],
];
for (const [nomeOriginal, grade] of [['BASE', BASE], ['SEGUNDA', SEGUNDA]]) {
  for (const [rotulo, transformada] of transformacoes(grade)) {
    verifica('CT-37', `${nomeOriginal}: ${rotulo}`, transformada, true);
  }
}

const mutar = (g, l, c) => comCelula(g, l, c, 1 - g[l][c]);
const basesParaMutacao = [BASE, SEGUNDA,
  GRADES_DISTINTAS[1], GRADES_DISTINTAS[100], GRADES_DISTINTAS[2000],
  GRADES_DISTINTAS[GRADES_DISTINTAS.length - 1]];
for (const [i, grade] of basesParaMutacao.entries()) {
  const celulas = [[0, 0], [2, 3], [5, 5]];
  const [l, c] = celulas[i % celulas.length];
  verifica('CT-38', `mutacao de uma celula da grade ${i + 1}`, mutar(grade, l, c), false);
}

// Pistas fixas e determinísticas, com solucao unica entre as 4140 grades.
const PISTAS_FIXAS = [
  [0, 3, 1], [3, 5, 0], [1, 3, 1], [2, 4, 1], [5, 4, 1], [2, 1, 1], [4, 1, 0],
  [1, 4, 0], [3, 1, 1], [4, 3, 1], [1, 0, 1], [2, 5, 1], [0, 2, 0], [4, 2, 1],
  [3, 3, 0], [0, 5, 0]
];
const estadoInicial = () => {
  const grade = Array.from({ length: 6 }, () => Array(6).fill(null));
  const pistas = Array.from({ length: 6 }, () => Array(6).fill(false));
  for (const [l, c, v] of PISTAS_FIXAS) { grade[l][c] = v; pistas[l][c] = true; }
  return { grade, pistas, vencedor: null, erro: null };
};
const comCelulaEstado = (estado, l, c, v, erro = null, vencedor = estado.vencedor) => ({
  grade: comCelula(estado.grade, l, c, v),
  pistas: clonar(estado.pistas),
  vencedor,
  erro
});
const comErro = (estado, motivo) => ({ ...clonar(estado), erro: motivo });
const gradeInvalidaTripla = () => {
  const g = copia(BASE);
  g[0] = [0, 0, 0, 1, 1, 1];
  return g;
};
const gradeInvalidaContagem = () => {
  const g = copia(BASE);
  g[0][0] = 0;
  return g;
};

verifica('CT-39', 'criarPartida entrega pistas fixas, 20 celulas livres e sem vencedor',
  {}, () => estadoInicial(), { funcao: () => criarPartida(), deep: true });

const estadoComPreenchida = () => comCelulaEstado(estadoInicial(), 0, 0, 1);
const jogadas40 = [
  { rotulo: 'celula livre com 0', l: 0, c: 0, v: 0, erro: null, estado: estadoInicial },
  { rotulo: 'celula livre com 1', l: 0, c: 0, v: 1, erro: null, estado: estadoInicial },
  { rotulo: 'pista nao pode ser alterada', l: 0, c: 3, v: 0, erro: 'celula e pista', estado: estadoInicial },
  { rotulo: 'linha fora da grade', l: 6, c: 0, v: 0, erro: 'fora da grade', estado: estadoInicial },
  { rotulo: 'coluna fora da grade', l: 0, c: -1, v: 0, erro: 'fora da grade', estado: estadoInicial },
  { rotulo: 'valor 2', l: 0, c: 0, v: 2, erro: 'valor deve ser 0 ou 1', estado: estadoInicial },
  { rotulo: 'valor textual', l: 0, c: 0, v: '1', erro: 'valor deve ser 0 ou 1', estado: estadoInicial },
  { rotulo: 'celula ja preenchida', l: 0, c: 0, v: 0, erro: 'celula ja preenchida', estado: estadoComPreenchida },
  { rotulo: 'jogada que cria tripla na coluna 1', l: 1, c: 1, v: 1, erro: 'jogada cria tripla ou contagem invalida', estado: estadoInicial },
  { rotulo: 'jogada que cria contagem errada na linha 2', l: 2, c: 0, v: 1, erro: 'jogada cria tripla ou contagem invalida', estado: estadoInicial },
];
for (const caso of jogadas40) {
  verifica('CT-40', caso.rotulo, caso.estado(),
    (estado) => caso.erro ? comErro(estado, caso.erro) : comCelulaEstado(estado, caso.l, caso.c, caso.v),
    { funcao: (estado) => preencher(estado, caso.l, caso.c, caso.v), deep: true });
}

verifica('CT-41', 'status incompleto no inicio da partida', estadoInicial(), 'incompleto',
  { funcao: status });
verifica('CT-41', 'status vitoria com grade completa e valida', estadoInicial(), 'vitoria',
  { funcao: (estado) => status({ ...estado, grade: copia(BASE) }) });
verifica('CT-41', 'status invalido com tripla', estadoInicial(), 'invalido',
  { funcao: (estado) => status({ ...estado, grade: gradeInvalidaTripla() }) });

verifica('CT-42', 'nao declarar vitoria com tripla e 36 celulas preenchidas',
  estadoInicial(), 'invalido',
  { funcao: (estado) => status({ ...estado, grade: gradeInvalidaTripla() }) });
verifica('CT-42', 'nao declarar vitoria com contagem errada e 36 celulas preenchidas',
  estadoInicial(), 'invalido',
  { funcao: (estado) => status({ ...estado, grade: gradeInvalidaContagem() }) });

verifica('CT-43', 'resolver devolve grade valida compativel com as pistas',
  estadoInicial(), undefined, {
    funcao: (estado) => resolver(estado.grade),
    apos: (solucao) => {
      assert.equal(validarGradeBinaria(solucao), true, 'CT-43: solucao valida');
      for (const [l, c, v] of PISTAS_FIXAS) {
        assert.equal(solucao[l][c], v, `CT-43: pista (${l},${c}) preservada`);
      }
      assert.deepEqual(solucao, resolver(estadoInicial().grade), 'CT-43: determinístico');
    }
  });

verifica('CT-43', 'dica preenche uma celula correta sem alterar o estado',
  estadoInicial(), (estado) => {
    const solucao = resolver(estado.grade);
    return comCelulaEstado(estado, 0, 0, solucao[0][0]);
  }, { funcao: (estado) => dica(estado), deep: true });

// Ciclo completo: todas as jogadas vem de resolver(); nenhuma solucao e fixa no teste.
const jogarAteVitoria = () => {
  const passos = [];
  let estado = criarPartida();
  const solucao = resolver(estado.grade);
  for (let l = 0; l < 6; l++) {
    for (let c = 0; c < 6; c++) {
      if (estado.grade[l][c] !== null) continue;
      const antes = clonar(estado);
      const proximo = preencher(estado, l, c, solucao[l][c]);
      passos.push({
        linha: l, coluna: c, erro: proximo.erro,
        status: status(proximo), vencedor: proximo.vencedor,
        intacto: deepIgual(estado, antes)
      });
      estado = proximo;
    }
  }
  return { estado, passos, statusFinal: status(estado) };
};
const deepIgual = (a, b) => {
  try { assert.deepEqual(a, b); return true; } catch (erro) { return false; }
};

verifica('CT-44', 'ciclo completo do puzzle inicial ate vitoria', {}, undefined, {
  funcao: jogarAteVitoria,
  apos: (resultado) => {
    assert.equal(resultado.passos.length, 20, 'CT-44: 20 celulas preenchidas');
    assert.deepEqual(resultado.passos.map((p) => p.erro).filter(Boolean), [],
      'CT-44: nenhuma jogada rejeitada');
    assert.ok(resultado.passos.slice(0, -1).every((p) => p.status === 'incompleto'),
      'CT-44: nenhum status de vitoria antes do fim');
    assert.ok(resultado.passos.slice(0, -1).every((p) => p.vencedor === null),
      'CT-44: nenhum vencedor prematuro');
    assert.equal(resultado.passos[resultado.passos.length - 1].vencedor, true,
      'CT-44: vencedor marcado na ultima jogada');
    assert.equal(resultado.statusFinal, 'vitoria', 'CT-44: vitoria no fim');
    assert.equal(resultado.estado.vencedor, true, 'CT-44: vencedor marcado');
  }
});

verifica('CT-45', 'nenhum estado e alterado no ciclo, inclusive em jogadas recusadas',
  {}, undefined, {
    funcao: () => {
      const ciclo = jogarAteVitoria();
      const inicio = estadoInicial();
      const copiaInicio = clonar(inicio);
      const recusada = preencher(inicio, 0, 3, 0);
      const fora = preencher(inicio, 9, 9, 1);
      return {
        passosIntactos: ciclo.passos.every((p) => p.intacto),
        recusadaIntacta: deepIgual(inicio, copiaInicio),
        recusadaErro: recusada.erro,
        recusadaGrade: deepIgual(recusada.grade, inicio.grade),
        foraErro: fora.erro,
        foraGrade: deepIgual(fora.grade, inicio.grade)
      };
    },
    apos: (r) => {
      assert.equal(r.passosIntactos, true, 'CT-45: estados intermediarios intactos');
      assert.equal(r.recusadaIntacta, true, 'CT-45: estado recebido intacto');
      assert.equal(r.recusadaGrade, true, 'CT-45: jogada recusada nao muda a grade');
      assert.ok(typeof r.recusadaErro === 'string' && r.recusadaErro.length > 0,
        'CT-45: erro descritivo');
      assert.equal(r.foraGrade, true, 'CT-45: coordenada invalida nao muda a grade');
      assert.ok(typeof r.foraErro === 'string' && r.foraErro.length > 0,
        'CT-45: erro para fora da grade');
    }
  });


// -------------------------------------------------------------------------
// Casos-limite adicionais: resolver sem solucao, dica em grade completa e
// preencher com estado malformado (CT-46 a CT-48).
// -------------------------------------------------------------------------

const pistasComTripla = () => {
  const grade = estadoInicial().grade;
  grade[0][0] = 1;
  grade[0][1] = 1;
  grade[0][2] = 1;
  return grade;
};
const pistasConflitantes = () => {
  const grade = estadoInicial().grade;
  grade[0][0] = 0;
  return grade;
};

verifica('CT-46', 'resolver devolve null para pistas com tripla', pistasComTripla(), null,
  { funcao: resolver });
verifica('CT-46', 'resolver devolve null para pista que contradiz a solucao unica', pistasConflitantes(), null,
  { funcao: resolver });

const estadoCompleto = () => ({ ...estadoInicial(), grade: copia(BASE) });
verifica('CT-47', 'dica em grade completa devolve erro sem alterar o estado', estadoCompleto(),
  (estado) => comErro(estado, 'grade completa'),
  { funcao: dica, deep: true });

const estadosMalformados = () => [null, {},
  { grade: estadoInicial().grade }, { pistas: estadoInicial().pistas }];
for (const estado of estadosMalformados()) {
  verifica('CT-48', 'preencher com estado malformado', estado,
    (entrada) => comErro(entrada, 'estado invalido'),
    { funcao: (entrada) => preencher(entrada, 0, 0, 1), deep: true });
}
