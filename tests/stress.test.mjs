import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularEstadoPlano } from '../src/stress.mjs';

const perto = (atual, esperado, tolerancia = 1e-9) => {
  assert.ok(Math.abs(atual - esperado) <= tolerancia, `${atual} ≠ ${esperado}`);
};

test('reproduz o caso de estado plano da planilha de referência', () => {
  const resultado = calcularEstadoPlano({ sigmaX: 18, sigmaY: 12, tauXY: -7 });

  perto(resultado.sigmaMedia, 15);
  perto(resultado.sigma1, 22.61577310586391);
  perto(resultado.sigma2, 7.384226894136091);
  perto(resultado.tauMax, 7.615773105863909);
});

test('calcula cisalhamento puro', () => {
  const resultado = calcularEstadoPlano({ sigmaX: 0, sigmaY: 0, tauXY: 50 });

  perto(resultado.sigma1, 50);
  perto(resultado.sigma2, -50);
  perto(resultado.tauMax, 50);
  perto(resultado.thetaPrincipalGraus, 45);
});

test('mantém tensões iguais quando não há cisalhamento', () => {
  const resultado = calcularEstadoPlano({ sigmaX: 80, sigmaY: 80, tauXY: 0 });

  perto(resultado.sigma1, 80);
  perto(resultado.sigma2, 80);
  perto(resultado.tauMax, 0);
});

test('rejeita entradas não numéricas ou infinitas', () => {
  assert.throws(
    () => calcularEstadoPlano({ sigmaX: Number.NaN, sigmaY: 10, tauXY: 2 }),
    /números finitos/,
  );
});
