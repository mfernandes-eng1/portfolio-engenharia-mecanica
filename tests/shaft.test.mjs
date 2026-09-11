import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularTensoesEixo } from '../src/shaft.mjs';

test('calcula flexão, torção e equivalentes para eixo circular', () => {
  const resultado = calcularTensoesEixo({ momento: 1147500, torque: 193800, diametro: 20 });

  assert.equal(resultado.tensaoFlexao, 1461.042);
  assert.equal(resultado.tensaoTorcao, 123.377);
  assert.equal(resultado.vonMises, 1476.587);
  assert.equal(resultado.tresca, 1481.733);
});

test('retorna tensões nulas quando momento e torque são nulos', () => {
  const resultado = calcularTensoesEixo({ momento: 0, torque: 0, diametro: 20 });

  assert.equal(resultado.tensaoFlexao, 0);
  assert.equal(resultado.tensaoTorcao, 0);
  assert.equal(resultado.vonMises, 0);
  assert.equal(resultado.tresca, 0);
});

test('aceita sinais nos esforços sem alterar magnitudes equivalentes', () => {
  const positivo = calcularTensoesEixo({ momento: 1000, torque: 500, diametro: 30 });
  const negativo = calcularTensoesEixo({ momento: -1000, torque: -500, diametro: 30 });

  assert.equal(positivo.vonMises, negativo.vonMises);
  assert.equal(positivo.tresca, negativo.tresca);
});

test('rejeita entradas físicas inválidas', () => {
  assert.throws(() => calcularTensoesEixo({ momento: 1, torque: 1, diametro: 0 }), /diâmetro/i);
  assert.throws(() => calcularTensoesEixo({ momento: NaN, torque: 1, diametro: 20 }), /números válidos/i);
});
