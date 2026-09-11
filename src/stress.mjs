const graus = (radianos) => (radianos * 180) / Math.PI;

export function calcularEstadoPlano({ sigmaX, sigmaY, tauXY }) {
  const entradas = [sigmaX, sigmaY, tauXY];

  if (!entradas.every(Number.isFinite)) {
    throw new TypeError('As tensões devem ser números finitos.');
  }

  const sigmaMedia = (sigmaX + sigmaY) / 2;
  const metadeDiferenca = (sigmaX - sigmaY) / 2;
  const raio = Math.hypot(metadeDiferenca, tauXY);

  return {
    sigmaMedia,
    sigma1: sigmaMedia + raio,
    sigma2: sigmaMedia - raio,
    tauMax: raio,
    thetaPrincipalGraus: graus(0.5 * Math.atan2(2 * tauXY, sigmaX - sigmaY)),
    centroMohr: sigmaMedia,
    raioMohr: raio,
  };
}
