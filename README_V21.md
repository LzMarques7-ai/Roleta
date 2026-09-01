# Roleta da Vida V21

## Correção principal
A V21 elimina o ponto único de falha que podia transformar qualquer exceção da montagem em “Falha ao montar a vida”. A ficha agora é normalizada antes da revelação e existe uma segunda forja completa como fallback.

## Arquitetura
- `library.js`: referências e resultados do banco local.
- `engine.js`: sorteio criptográfico, normalização, raridade, sinergias e composição.
- `story.js`: explicação narrativa da vida e das referências.
- `sources.js`: contrato de procedência.
- `visual-database.js`: atlas de formas.
- `visual-engine.js`: diretor visual local que combina formas em SVG.
- `reference-upgrade.js`: compatibilidade.
- `app.js`: fluxo da roleta e tela final.
- `style.css`: interface e responsividade.

## O que muda visualmente
A arte não usa mais um único boneco com pequenas variações. O diretor escolhe, a partir do DNA sorteado, geometria facial, formato dos olhos, sobrancelhas, nariz, boca, tom de pele, cor e corte de cabelo, proporções corporais, roupa, anatomia de espécie, pose, cenário, equipamento, motivo gráfico, partículas e efeitos de raridade.

As referências continuam sendo mostradas na ficha para responder “quem/qual obra serviu de referência” e “por que essa referência apareceu”. A referência é explicativa, não uma instrução para copiar a aparência de alguém.

## Sem créditos
Não há Puter, Bing, OpenAI, API key, login, saldo ou crédito. A geração visual é local e sempre tenta produzir um SVG.

## Ordem obrigatória no `index.html`
1. library.js
2. engine.js
3. story.js
4. sources.js
5. visual-database.js
6. visual-engine.js
7. reference-upgrade.js
8. app.js
