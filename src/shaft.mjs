1|function arredondar(valor) {
2|  return Number(valor.toFixed(3));
3|}
4|
5|export function calcularTensoesEixo({ momento, torque, diametro }) {
6|  const entradas = [momento, torque, diametro];
7|
8|  if (!entradas.every(Number.isFinite)) {
9|    throw new TypeError('Momento, torque e diâmetro devem ser números válidos.');
10|  }
11|
12|  if (diametro <= 0) {
13|    throw new RangeError('O diâmetro deve ser maior que zero.');
14|  }
15|
16|  const tensaoFlexao = (32 * momento) / (Math.PI * diametro ** 3);
17|  const tensaoTorcao = (16 * torque) / (Math.PI * diametro ** 3);
18|  const vonMises = Math.sqrt(tensaoFlexao ** 2 + 3 * tensaoTorcao ** 2);
19|  const tresca = Math.sqrt(tensaoFlexao ** 2 + 4 * tensaoTorcao ** 2);
20|
21|  return {
22|    tensaoFlexao: arredondar(tensaoFlexao),
23|    tensaoTorcao: arredondar(tensaoTorcao),
24|    vonMises: arredondar(vonMises),
25|    tresca: arredondar(tresca),
26|  };
27|}
28|