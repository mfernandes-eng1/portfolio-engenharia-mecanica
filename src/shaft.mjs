function arredondar(valor) {
  return Number(valor.toFixed(3));
}

export function calcularTensoesEixo({ momento, torque, diametro }) {
  const entradas = [momento, torque, diametro];

  if (!entradas.every(Number.isFinite)) {
    throw new TypeError('Momento, torque e diâmetro devem ser números válidos.');
  }

  if (diametro <= 0) {
    throw new RangeError('O diâmetro deve ser maior que zero.');
  }

  const tensaoFlexao = (32 * momento) / (Math.PI * diametro ** 3);
  const tensaoTorcao = (16 * torque) / (Math.PI * diametro ** 3);
  const vonMises = Math.sqrt(tensaoFlexao ** 2 + 3 * tensaoTorcao ** 2);
  const tresca = Math.sqrt(tensaoFlexao ** 2 + 4 * tensaoTorcao ** 2);

  return {
    tensaoFlexao: arredondar(tensaoFlexao),
    tensaoTorcao: arredondar(tensaoTorcao),
    vonMises: arredondar(vonMises),
    tresca: arredondar(tresca),
  };
}
