# Character Roulette V5 — completa

Esta versão não finge que uma lista de algumas dezenas é "infinita".

## Bibliotecas conectadas

### Anime / mangá
O aplicativo carrega em tempo de execução o **Anime Character Offline Database**, que declara 12.345 personagens no snapshot publicado e fornece JSON público. A licença indicada pelo projeto é ODbL 1.0 + DbCL 1.0.

### Quadrinhos
O aplicativo carrega o **Superhero API (akabab)**, com 731 personagens e powerstats de inteligência, força, velocidade, durabilidade, poder e combate. O repositório declara licença MIT.

### Expansão futura
O catálogo também registra Jikan/MyAnimeList e TMDB como fontes de expansão. Jikan oferece dados de personagens e aparições; TMDB oferece API de filmes/séries, mas exige chave e concordância com os termos.

## Regra da roleta

Dentro de uma categoria:

`chance de cada opção = 1 / número de opções`

Não existe raridade, peso, "meta", balanceamento ou correção baseada no resultado anterior.

## Fluxo

1. Qual sua raça?
2. Qual seu título?
3. Idade?
4. Força e durabilidade?
5. Velocidade?
6. Inteligência?
7. Combate?
8. Possui poderes?
9. Se sim: qual poder?
10. Arma?
11. Sorte?
12. Fraqueza?
13. Potencial?
14. História e ficha final.

## Importante sobre "infinita"

Nenhum banco de dados real da internet é literalmente infinito. A V5 resolve isso de forma prática: o motor aceita catálogos locais + catálogos remotos e pode receber novas fontes sem alterar o motor da roleta.

Isso também evita copiar indiscriminadamente material de terceiros para dentro do repositório. As fontes ficam referenciadas e os dados públicos compatíveis são carregados no navegador.

## GitHub Pages

Todos os arquivos são independentes:

- index.html
- style.css
- library.js
- library-loader.js
- sources.js
- app.js
- README.md
