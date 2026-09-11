1|import { calcularTensoesEixo } from './shaft.mjs';
2|
3|const formulario = document.querySelector('#shaft-form');
4|const erro = document.querySelector('#shaft-error');
5|const saidas = {
6|  flexao: document.querySelector('#shaft-sigma'),
7|  torcao: document.querySelector('#shaft-tau'),
8|  vonMises: document.querySelector('#shaft-vm'),
9|  tresca: document.querySelector('#shaft-tresca'),
10|};
11|
12|const formatador = new Intl.NumberFormat('pt-BR', {
13|  maximumFractionDigits: 3,
14|  minimumFractionDigits: 0,
15|});
16|
17|function atualizar() {
18|  erro.hidden = true;
19|
20|  try {
21|    const resultado = calcularTensoesEixo({
22|      momento: Number(formulario.elements.momento.value),
23|      torque: Number(formulario.elements.torque.value),
24|      diametro: Number(formulario.elements.diametro.value),
25|    });
26|
27|    saidas.flexao.textContent = formatador.format(resultado.tensaoFlexao);
28|    saidas.torcao.textContent = formatador.format(resultado.tensaoTorcao);
29|    saidas.vonMises.textContent = formatador.format(resultado.vonMises);
30|    saidas.tresca.textContent = formatador.format(resultado.tresca);
31|  } catch (falha) {
32|    erro.textContent = falha.message;
33|    erro.hidden = false;
34|  }
35|}
36|
37|formulario.addEventListener('submit', (evento) => {
38|  evento.preventDefault();
39|  atualizar();
40|});
41|
42|document.querySelector('#year').textContent = new Date().getFullYear();
43|atualizar();
44|