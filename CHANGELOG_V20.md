# Roleta da Vida V20 — correções

## Correções críticas
- O fluxo final agora valida a ficha antes de tentar renderizar.
- Se algum resultado estiver ausente, o sistema não quebra silenciosamente.
- A arte não depende mais de `Blob URL` + decodificação de `<img>`: o SVG é inserido diretamente no DOM.
- O arquivo `visual-database.js` é carregado explicitamente antes do `visual-engine.js`.
- O fluxo de roleta mantém sorteios independentes e com reposição.

## Novo sistema visual
- Banco local de formas com 13 famílias de construção.
- Variação de rosto, olhos, sobrancelhas, nariz, boca e cabelo.
- Variação de proporções corporais e silhueta.
- Roupas diferentes por função/arquétipo.
- Poses ligadas a velocidade, combate, status e natureza.
- Anatomia específica para dragão, demônio, anjo, fera, cibernético etc.
- Cenários com camadas de profundidade.
- Partículas, anéis, brilhos, fragmentos e holografia escalados pela raridade.
- A composição continua sendo determinada pelo DNA sorteado e por uma `visualSeed`, portanto o mesmo personagem pode ser reconstruído de forma consistente.

## Referências
O sistema continua mostrando a procedência de cada atributo: pessoa, personagem, obra, mitologia ou arquétipo que serviu como referência e o motivo dessa referência. A referência é explicativa; o renderizador não tenta copiar uma arte existente.
