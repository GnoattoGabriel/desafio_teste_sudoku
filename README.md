# desafio_teste_sudoku

Casos de teste para o desafio **Sudoku binário (by Zulli)** da disciplina
Projeto, Implementação e Teste de Software — 2026.

**Colaborador:** Gabriel de Oliveira Gnoatto — RA 23298801-2 (individual).

## 1. Especificação do desafio

- **Jogo:** sudoku binário (binairo) com grade de **6 colunas × 6 linhas**.
- **Regras consideradas:**
  1. cada célula recebe apenas `0` ou `1`;
  2. cada linha e cada coluna contêm exatamente **três `0` e três `1`**;
  3. nenhuma linha ou coluna possui **três valores iguais consecutivos**;
  4. nenhuma linha se repete e nenhuma coluna se repete;
  5. a grade é válida somente se estiver **completa** (36 células preenchidas).
- **Premissa explícita:** o enunciado em `desafios.md` não enumera as regras do
  jogo — ele pede apenas "casos de teste para testar Sudoku binário de tamanho
  6 x 6". A regra 4 foi adotada como parte da definição padrão de
  binairo/Takuzu e **mantida** para não alterar a especificação já entregue.
  Ela está sinalizada como premissa no `.docx` e aqui. Se o professor adotar
  apenas as regras 1, 2, 3 e 5, os casos CT-08, CT-09 e os que dependem da
  regra 4 devem ser reavaliados.
- **Interface esperada em JavaScript:** função `validarGradeBinaria(grid)` que
  recebe uma matriz 6×6 e retorna `true` somente se a grade estiver completa e
  válida; caso contrário, retorna `false`.
- **Representação dos dados:** `0` e `1` são números; uma célula vazia é
  representada por `null`. A função não deve alterar a grade recebida.
- **Posição das triplas:** com exatamente três `0` e três `1` por linha/coluna,
  uma tripla no início ou no fim sempre traz a tripla complementar na extremidade
  oposta. Por isso CT-06, CT-07, CT-28 e CT-29 cobrem início de linha, início de
  coluna, meio de linha e meio de coluna — as únicas posições isoláveis.

O escopo deste desafio é a **validação da grade**. A IA que receber estes casos
deve implementar a função acima de forma a satisfazer todos eles.

## 2. Funcionamento dos casos de teste

Os casos estão no arquivo
[`casos_de_teste_sudoku_binario.docx`](casos_de_teste_sudoku_binario.docx),
no padrão do template oficial da disciplina (`Caso de Teste.docx`). Cada caso
contém:

- **Descrição** — o que se quer verificar;
- **Pré-condições** — estado necessário antes da execução;
- **Passos** — ações realizadas;
- **Cenário 1** com **Dados de Teste** (a grade 6×6, linha a linha) e
  **Resultado Esperado** (valor de retorno, regra violada e justificativa);
- **Pós-condições** — efeito após a execução.

Cada caso do `.docx` tem um teste equivalente em `test/sudoku.test.js`, com o
mesmo ID (CT-01 a CT-29). Assim fica atendida a exigência do enunciado:
**casos de teste em Javascript para testar Javascript**. O `.docx` continua
sendo a especificação legível; o arquivo `.js` é a versão executável dos mesmos
casos.

### Casos incluídos

| ID | Objetivo | Retorno esperado |
|---|---|---|
| CT-01 | Grade completa e correta (com verificação de não mutação) | `true` |
| CT-02 | Célula com valor `2` (regra isolada) | `false` |
| CT-03 | Célula vazia (`null`) | `false` |
| CT-04 | Linha com quatro `1` | `false` |
| CT-05 | Coluna com quatro `0` | `false` |
| CT-06 | Três valores iguais consecutivos em uma linha (regra isolada) | `false` |
| CT-07 | Três valores iguais consecutivos em uma coluna (regra isolada) | `false` |
| CT-08 | Duas linhas idênticas (regra isolada) | `false` |
| CT-09 | Duas colunas idênticas (regra isolada) | `false` |
| CT-10 | Grade com 5 linhas × 6 colunas | `false` |
| CT-11 | Célula com texto `"1"` em vez do número `1` | `false` |
| CT-12 | Parâmetro `null` | `false` |
| CT-13 | Segunda grade válida, não simétrica e sem linhas da primeira | `true` |
| CT-14 | Valor `2` na segunda grade | `false` |
| CT-15 | Linha com 5 células | `false` |
| CT-16 | Linha com 7 células | `false` |
| CT-17 | Entrada que não é matriz (string) | `false` |
| CT-18 | Células booleanas `true`/`false` | `false` |
| CT-19 | Célula com `NaN` | `false` |
| CT-20 | Célula com `undefined` | `false` |
| CT-21 | Confirmação explícita de que a grade não é alterada | `true` |
| CT-22 | Célula com valor `-1` | `false` |
| CT-23 | Célula com valor decimal `0.5` | `false` |
| CT-24 | Matriz com 7 linhas × 6 colunas | `false` |
| CT-25 | Entradas `42`, `{}` e `true` (não matrizes) | `false` |
| CT-26 | Linha representada como string | `false` |
| CT-27 | Quatro células vazias (`null`) | `false` |
| CT-28 | Três `1` consecutivos no meio de uma linha (regra isolada) | `false` |
| CT-29 | Três `0` consecutivos no meio de uma coluna (regra isolada) | `false` |

### Cobertura das regras

| Regra da especificação | Casos que a cobrem |
|---|---|
| Domínio `0`/`1` e tipo numérico | CT-02, CT-11, CT-14, CT-18, CT-19, CT-20, CT-22, CT-23 |
| Grade completa (36 células) | CT-03, CT-27 |
| Dimensão 6×6 | CT-10, CT-15, CT-16, CT-17, CT-24, CT-25, CT-26 |
| Três `0` e três `1` por linha | CT-04 |
| Três `0` e três `1` por coluna | CT-05 |
| Sem três iguais consecutivos na linha | CT-06, CT-28 |
| Sem três iguais consecutivos na coluna | CT-07, CT-29 |
| Linhas distintas | CT-08 |
| Colunas distintas | CT-09 |
| Caminho válido (aceitação) | CT-01, CT-13, CT-21 |
| Entrada ausente/não matriz tratada sem erro | CT-12, CT-17, CT-25, CT-26 |
| Não mutação da entrada | CT-01, CT-21 |

### Isolamento das regras

- CT-02, CT-06, CT-07, CT-08, CT-09, CT-28 e CT-29 usam grades obtidas por
  busca exaustiva nas quais **somente** a regra declarada no resultado esperado
  é violada. CT-28 e CT-29 cobrem o meio da linha/coluna, posição que as triplas
  das extremidades não conseguem isolar.
- CT-04 e CT-05 **não podem ser isolados**: como a soma de uns do tabuleiro é
  18 tanto por linhas quanto por colunas, alterar a contagem de uma linha
  reflete em uma coluna (e vice-versa). Os resultados esperados afirmam
  honestamente esse efeito colateral.
- Nos casos de dimensão e de tipo inválido, as regras de jogo deixam de ser
  integralmente aplicáveis; o resultado esperado declara qual requisito de
  entrada foi violado.

### Casos executáveis em JavaScript

- **Runner:** `node --test` (nativo do Node.js 18+). Não há dependências para
  instalar.
- **Executar:** `npm test` na raiz do repositório.
- **Contrato da implementação:** criar `src/validarGradeBinaria.js` exportando
  `validarGradeBinaria` em CommonJS:

  ```js
  module.exports = { validarGradeBinaria };
  ```

- **Situação atual:** os 29 testes existem e falham (`# fail 29`) com a
  mensagem "Crie src/validarGradeBinaria.js exportando validarGradeBinaria".
  Esse é o estado RED esperado: a IA deve gerar a implementação a partir dos
  casos, sem que este repositório entregue o código do jogo.
- **Dados JavaScript usados nos testes:** números `0`/`1`, `-1`, `0.5`, `null`,
  `undefined`, `NaN`, booleanos `true`/`false`, número `42`, objeto `{}`,
  strings `"1"` e `"110100"`, linhas com 5 ou 7 células e matrizes com 5 ou 7
  linhas. O CT-21 verifica também que a entrada não é alterada.

### Grades de referência

Grade do CT-01 (referência original):

```
1 1 0 1 0 0
1 0 1 1 0 0
0 1 0 0 1 1
1 1 0 0 1 0
0 0 1 1 0 1
0 0 1 0 1 1
```

Segunda grade válida do CT-13 (não simétrica, sem linhas da primeira):

```
1 0 1 0 1 0
0 1 1 0 1 0
1 0 0 1 0 1
1 0 0 1 1 0
0 1 1 0 0 1
0 1 0 1 0 1
```

A existência da segunda grade impede que uma implementação que apenas compare
a entrada com a grade do CT-01 seja aprovada: ela retornaria `false` no CT-13.
A grade do CT-01 é simétrica (linha *i* = coluna *i*); a do CT-13 quebra essa
propriedade. CT-06 a CT-09, CT-14, CT-28 e CT-29 também não derivam da grade
original.

## 3. Estrutura do repositório

```
desafio_teste_sudoku/
├── README.md
├── package.json
├── casos_de_teste_sudoku_binario.docx
└── test/
    └── sudoku.test.js
```

Não há implementação do jogo neste repositório: o entregável é a especificação
dos casos (`.docx`) e sua versão executável em JavaScript (`test/`). Abra o
`.docx` com Microsoft Word ou LibreOffice Writer e rode `npm test` para executar
os 29 casos.

## 4. Colaboradores

- Gabriel de Oliveira Gnoatto — RA 23298801-2
