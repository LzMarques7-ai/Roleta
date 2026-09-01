# Roleta da Vida V20 — Character Forge

## O que mudou
- Banco local muito maior e orientado a referências.
- Força, velocidade, inteligência, combate, poderes e armas podem cair em pessoas reais, personagens, criaturas, mitologias, obras e arquétipos.
- Sorteio independente com reposição: combinações não são limitadas por shuffle bag.
- Raridade é calculada depois dos giros, pela combinação do personagem.
- Cada resultado guarda procedência: quem/qual obra/arquetipo foi usado como referência e por quê.
- Motor narrativo local explica a ficha e as referências.
- Motor visual local monta a arte em SVG por elementos: anatomia, rosto, cabelo, roupa, acessórios, pose, arma, ambiente, aura, partículas e efeitos.
- Raridades altas recebem mais camadas, holografia e partículas.
- Nenhum Puter, Bing, OpenAI, API key, login, saldo ou crédito é necessário.

## Ordem oficial
1. library.js
2. engine.js
3. story.js
4. sources.js
5. visual-engine.js
6. app.js

`style.css` é carregado pelo `index.html`.

## Importante sobre "IA"
Esta versão não depende de um modelo de IA remoto. O comportamento de "diretor visual/narrativo" é procedural: regras + banco de referências + composição determinística. Isso garante uma imagem em toda geração mesmo sem créditos.


## V20 — Banco de Formas Visual
A arte agora é construída por um atlas local de formas: formatos de rosto, olhos, sobrancelhas, nariz, boca, cabelos, proporções corporais, roupas, poses, anatomias de espécie, cenários, equipamentos e partículas. O DNA da roleta seleciona e combina essas peças em vez de desenhar sempre o mesmo boneco.

A saída visual é um SVG inserido diretamente no DOM. Isso remove a etapa de carregar uma imagem blob/URL e reduz o risco de a tela ficar vazia em celulares.

## Arquivos
- `visual-database.js`: banco de formas reutilizáveis.
- `visual-engine.js`: compositor visual que transforma DNA + formas em arte.
- `app.js`: fluxo da roleta, montagem e tratamento de erros.
