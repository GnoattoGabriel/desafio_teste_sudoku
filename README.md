# desafio_teste_sudoku

Casos de teste para o desafio **Sudoku binário** da disciplina
Projeto, Implementação e Teste de Software — 2026.

**Colaborador:** Gabriel de Oliveira Gnoatto — RA 23298801-2 (individual).

## 1. Especificação do desafio

- **Jogo:** sudoku binário com grade de **6 colunas × 6 linhas**.
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
  regra 4 devem ser reavaliados. Os CT-35 e CT-36 enumeram as grades com e sem
  essa regra e registram a diferença: 4.140 válidas com regra 4, 11.222 sem
  ela, 7.082 rejeitadas.
- **Interface esperada em JavaScript:** o mesmo módulo
  `src/validarGradeBinaria.js` exporta o validador e a camada de puzzle:

  ```js
  module.exports = {
    validarGradeBinaria, // (grid) => true | false
    criarPartida,        // () => { grade, pistas, vencedor, erro }
    preencher,           // (estado, linha, coluna, valor) => novo estado
    status,              // (estado) => 'incompleto' | 'invalido' | 'vitoria'
    resolver,            // (gradeComPistas) => grade valida | null
    dica                 // (estado) => estado com uma celula preenchida
  };
  ```

  `validarGradeBinaria(grid)` recebe uma matriz 6×6 e retorna `true` somente se
  a grade estiver completa e válida; caso contrário, retorna `false`. As demais
  funções implementam o puzzle e **não alteram** o estado recebido: devolvem
  sempre um objeto novo. Pistas são imutáveis; células vazias são `null`.
- **Representação dos dados:** `0` e `1` são números; uma célula vazia é
  representada por `null`. `pistas[l][c]` é `true` nas células fixas. Nenhuma
  função altera a grade, as pistas ou o estado recebidos.
- **Regras do puzzle (decisão registrada):** `preencher` **bloqueia** jogadas
  que criam tripla ou contagem acima de três — o erro volta no campo `erro` do
  novo estado, com a grade inalterada. `status` reporta `'invalido'` para um
  estado inconsistente e só declara `'vitoria'` com as 36 células preenchidas e
  todas as regras satisfeitas.
- **Casos-limite:** `vencedor` continua `null` em todos os passos intermediários
  e só vira `true` na última jogada (CT-44). `resolver` devolve `null` quando as
  pistas não têm solução (CT-46); `dica` sobre grade completa devolve
  `erro: 'grade completa'` (CT-47); `preencher` com estado sem `grade`/`pistas`
  devolve `erro: 'estado invalido'` (CT-48).
- **Posição das triplas:** com exatamente três `0` e três `1` por linha/coluna,
  uma tripla no início ou no fim sempre traz a tripla complementar na extremidade
  oposta. Por isso CT-06, CT-07, CT-28 e CT-29 cobrem início de linha, início de
  coluna, meio de linha e meio de coluna — as únicas posições isoláveis.

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
mesmo ID (CT-01 a CT-48). Assim fica atendida a exigência do enunciado:
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
| CT-30 | Terceira grade válida, com padrão diferente das duas referências | `true` |
| CT-31 | Quarta grade válida, com ordem de linhas diferente | `true` |
| CT-32 | Quinta grade válida, com padrão diferente das duas referências | `true` |
| CT-33 | Sexta grade válida, com padrão diferente das duas referências | `true` |
| CT-34 | 120 grades válidas geradas deterministicamente | `true` (120 chamadas) |
| CT-35 | Enumeração completa: 4.140 grades com as 5 regras | `true` em todas |
| CT-36 | Enumeração completa: 11.222 grades; 4.140 aceitas, 7.082 rejeitadas | conforme regra 4 |
| CT-37 | 12 transformações que preservam validade em BASE e SEGUNDA | `true` em todas |
| CT-38 | Mutação de uma célula em 6 grades válidas diferentes | `false` em todas |
| CT-39 | `criarPartida()` com 16 pistas fixas e 20 células livres | estado determinístico |
| CT-40 | `preencher`: aceita 0/1; rejeita pista, fora da grade, valor inválido, célula ocupada, tripla e contagem | novo estado / `erro` |
| CT-41 | `status` nos estados incompleto, válido e inválido | `incompleto` / `vitoria` / `invalido` |
| CT-42 | 36 células preenchidas com tripla ou contagem errada não são vitória | `invalido` |
| CT-43 | `resolver` devolve solução válida; `dica` preenche uma célula correta | grade válida / estado novo |
| CT-44 | Ciclo completo: 20 jogadas do início até `vitoria` | `vitoria`, `vencedor: true` |
| CT-45 | Não mutação em todo o ciclo e em jogadas recusadas | estados intactos |
| CT-46 | `resolver` com pistas sem solução (tripla e pista conflitante) | `null` |
| CT-47 | `dica` sobre grade completa | estado com `erro: 'grade completa'` |
| CT-48 | `preencher` com estado malformado (`null`, `{}`, sem `grade`/`pistas`) | `erro: 'estado invalido'` |

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
| Caminho válido (aceitação) | CT-01, CT-13, CT-21, CT-30 a CT-34 |
| Entrada ausente/não matriz tratada sem erro | CT-12, CT-17, CT-25, CT-26 |
| Não mutação da entrada | todos os casos (helper `verifica`), mais CT-21, CT-34 e CT-45 |
| Propriedade: todas as grades válidas | CT-35, CT-36 |
| Transformações que preservam validade | CT-37 |
| Mutações que quebram a validade | CT-38 |
| Puzzle: pistas e jogadas | CT-39, CT-40 |
| Puzzle: status e fim de jogo | CT-41, CT-42, CT-44 |
| Puzzle: solução e dica | CT-43 |
| Puzzle: não mutação | CT-45 |
| Vencedor apenas no fim | CT-44 |
| Puzzle: solução impossível | CT-46 |
| Puzzle: dica em grade completa | CT-47 |
| Puzzle: estado malformado | CT-48 |

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
  module.exports = {
    validarGradeBinaria, criarPartida, preencher, status, resolver, dica
  };
  ```

- **Situação atual:** os 48 casos viram 81 testes (CT-37 tem 12 linhas, CT-38
  tem 6, CT-40 tem 10, CT-41 tem 3, CT-42/CT-43 têm 2, CT-46 tem 2 e CT-48 tem
  4) e falham: `# tests 81`, `# pass 0`, `# fail 81`. Esse é o estado **RED**
  esperado; a implementação do jogo não faz parte do entregável. As mensagens
  citam `src/validarGradeBinaria.js` e trazem o `stack` real de carregamento.
- **Ciclo TDD:** o GREEN (81/81), a refatoração e as variantes defeituosas
  (tabela de consulta, sem regra 4, `preencher` permissivo, `status` prematuro,
  `dica` fixa em `0`, `vencedor` marcado na primeira jogada, `resolver` que
  devolve grade para pistas impossíveis, `dica` sem distinção de grade completa
  e `preencher` sem validação de estado) foram executados em cópia descartável
  com implementação de referência. Nenhuma implementação foi deixada aqui.
- **Dados JavaScript usados nos testes:** números `0`/`1`, `-1`, `0.5`, `null`,
  `undefined`, `NaN`, booleanos `true`/`false`, número `42`, objeto `{}`,
  strings `"1"` e `"110100"`, linhas com 5 ou 7 células e matrizes com 5 ou 7
  linhas. A não mutação é conferida em **todos** os casos pelo helper `verifica`
  (preservando `NaN` e `undefined`); CT-21 e CT-34 reforçam a verificação.
  O CT-34 gera 120 grades válidas por enumeração determinística — sem
  `Math.random` nem relógio — e exige `true` em todas elas. Os CT-35 e CT-36
  enumeram **todas** as grades possíveis (4.140 e 11.222) com o mesmo
  procedimento determinístico e conferem a entrada e a saída em cada uma.
  A camada de puzzle usa 16 pistas fixas: nenhum caso sorteia ou lê relógio;
  o ciclo do CT-44 extrai as jogadas de `resolver`, não de uma sequência
  escrita à mão.

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
original. Isso, porém, ainda permitia o atalho `equals(BASE) ||
equals(SEGUNDA)`: ele passava nos 29 casos originais. Os CT-30 a CT-33 são
outras grades válidas (cada uma com no máximo 2 linhas em comum com cada
referência) e o CT-34 enumera 120 grades a partir das próprias regras. Uma
tabela de consulta falha já no CT-30. Mesmo uma tabela com as 4.140 grades
válidas não passaria: os CT-37 e CT-38 exigem as transformações e as mutações,
os CT-35/CT-36 cobrem o espaço inteiro de grades e os CT-39 a CT-45 exigem a
camada de puzzle, inclusive um ciclo de 20 jogadas até `vitoria` sem conhecer a
solução de antemão.

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
os 48 casos.

## 4. Colaboradores

- Gabriel de Oliveira Gnoatto — RA 23298801-2
