1|# Murilo Fernandes — Engenharia Mecânica
2|
3|Portfólio técnico com ferramentas próprias de Engenharia Mecânica.
4|
5|**Site:** https://mfernandes-eng1.github.io/portfolio-engenharia-mecanica/
6|
7|## Ferramentas
8|
9|### 01 — Estado plano de tensão
10|
11|A calculadora de estado plano de tensão recebe `σx`, `σy` e `τxy` e retorna:
12|
13|- tensões principais `σ1` e `σ2`;
14|- tensão máxima de cisalhamento;
15|- orientação principal;
16|- representação do círculo de Mohr.
17|
18|Os cálculos são executados no navegador e não enviam dados a um servidor.
19|
20|### 02 — Flexão e torção em eixos
21|
22|Módulo em desenvolvimento para eixo circular maciço, com cálculo de:
23|
24|- tensão normal de flexão;
25|- tensão de cisalhamento por torção;
26|- tensão equivalente de von Mises;
27|- tensão equivalente de Tresca.
28|
29|O módulo está disponível em [`eixos.html`](eixos.html).
30|
31|## Executar localmente
32|
33|```bash
34|python3 -m http.server 8000
35|```
36|
37|Abra `http://localhost:8000`.
38|
39|## Testes
40|
41|```bash
42|node --test tests/stress.test.mjs tests/shaft.test.mjs
43|```
44|
45|Os testes incluem o caso usado na planilha acadêmica de referência, cisalhamento puro, tensões normais iguais e validação de entradas inválidas. A planilha original e materiais do professor não fazem parte deste repositório.
46|
47|## Autoria
48|
49|Idealizado e validado tecnicamente por Murilo Fernandes. Desenvolvido com assistência de inteligência artificial.
50|