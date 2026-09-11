1|import test from 'node:test';
2|import assert from 'node:assert/strict';
3|import { calcularTensoesEixo } from '../src/shaft.mjs';
4|
5|test('calcula flexão, torção e equivalentes para eixo circular', () => {
6|  const resultado = calcularTensoesEixo({ momento: 1147500, torque: 193800, diametro: 20 });
7|
8|  assert.equal(resultado.tensaoFlexao, 1461.042);
9|  assert.equal(resultado.tensaoTorcao, 123.377);
10|  assert.equal(resultado.vonMises, 1476.587);
11|  assert.equal(resultado.tresca, 1481.733);
12|});
13|
14|test('retorna tensões nulas quando momento e torque são nulos', () => {
15|  const resultado = calcularTensoesEixo({ momento: 0, torque: 0, diametro: 20 });
16|
17|  assert.equal(resultado.tensaoFlexao, 0);
18|  assert.equal(resultado.tensaoTorcao, 0);
19|  assert.equal(resultado.vonMises, 0);
20|  assert.equal(resultado.tresca, 0);
21|});
22|
23|test('aceita sinais nos esforços sem alterar magnitudes equivalentes', () => {
24|  const positivo = calcularTensoesEixo({ momento: 1000, torque: 500, diametro: 30 });
25|  const negativo = calcularTensoesEixo({ momento: -1000, torque: -500, diametro: 30 });
26|
27|  assert.equal(positivo.vonMises, negativo.vonMises);
28|  assert.equal(positivo.tresca, negativo.tresca);
29|});
30|
31|test('rejeita entradas físicas inválidas', () => {
32|  assert.throws(() => calcularTensoesEixo({ momento: 1, torque: 1, diametro: 0 }), /diâmetro/i);
33|  assert.throws(() => calcularTensoesEixo({ momento: NaN, torque: 1, diametro: 20 }), /números válidos/i);
34|});
35|