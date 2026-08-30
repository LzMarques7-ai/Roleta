# Roleta da Vida — V6

## Ideia
A roleta é deliberadamente minimalista. Ela não imprime os nomes das milhares de possibilidades na roda: os dados ficam na biblioteca e o ponteiro representa apenas o sorteio.

## Fluxo
Raça → Título → Idade → Força e resistência → Velocidade → Inteligência → Combate → Possui poderes? → Poder (se sim) → Arma → ficha final.

## Aleatoriedade
Cada entrada da categoria escolhida recebe peso 1. A escolha é feita com `Math.floor(Math.random() * list.length)`. A animação então gira até a posição correspondente.

## Biblioteca
A V6 separa:
- `library.js`: biblioteca local, referências de sistemas de poder e expansão procedural;
- `sources.js`: conectores opcionais para Jikan, MediaWiki/Wikipedia e Open Library;
- `app.js`: motor;
- `style.css`: interface.

A web não oferece uma biblioteca universal e infinita de toda a ficção. Por isso a arquitetura usa biblioteca local + expansão procedural + fontes externas opcionais, sem fazer o jogo depender da internet.

Jikan documenta endpoints para personagens de anime/mangá.
MediaWiki REST permite pesquisa de páginas.
Open Library oferece APIs de busca de obras/livros e recomenda cache/uso de baixa frequência.

## Nota sobre referências
Nomes de sistemas, espécies e conceitos de obras podem aparecer como referências culturais; o jogo não baixa obras protegidas nem depende de copiar textos de personagens.
