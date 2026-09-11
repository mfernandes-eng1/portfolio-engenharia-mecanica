import { calcularEstadoPlano } from './stress.mjs';

const formulario = document.querySelector('#stress-form');
const unidade = document.querySelector('#unit');
const erro = document.querySelector('#form-error');
const canvas = document.querySelector('#mohr-canvas');

const saidas = {
  sigma1: document.querySelector('#sigma-1'),
  sigma2: document.querySelector('#sigma-2'),
  tauMax: document.querySelector('#tau-max'),
  theta: document.querySelector('#theta-p'),
  unidade: document.querySelector('#result-unit'),
};

const formatador = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 3,
  minimumFractionDigits: 0,
});

function formatar(valor) {
  const seguro = Math.abs(valor) < 1e-12 ? 0 : valor;
  return formatador.format(seguro);
}

function desenharCirculo(resultado, entradas) {
  const contexto = canvas.getContext('2d');
  const largura = canvas.width;
  const altura = canvas.height;
  const margem = 72;
  const { sigma1, sigma2, tauMax, centroMohr, raioMohr } = resultado;
  const limiteX = Math.max(Math.abs(sigma1), Math.abs(sigma2), Math.abs(centroMohr) + raioMohr, 1) * 1.18;
  const limiteY = Math.max(tauMax, 1) * 1.35;
  const escalaX = (largura - margem * 2) / (limiteX * 2);
  const escalaY = (altura - margem * 2) / (limiteY * 2);
  const escala = Math.min(escalaX, escalaY);
  const origemX = largura / 2;
  const origemY = altura / 2;
  const x = (valor) => origemX + valor * escala;
  const y = (valor) => origemY - valor * escala;

  contexto.clearRect(0, 0, largura, altura);
  contexto.lineCap = 'round';
  contexto.lineJoin = 'round';

  contexto.strokeStyle = '#363940';
  contexto.lineWidth = 1;
  contexto.beginPath();
  contexto.moveTo(margem / 2, origemY);
  contexto.lineTo(largura - margem / 2, origemY);
  contexto.moveTo(origemX, margem / 2);
  contexto.lineTo(origemX, altura - margem / 2);
  contexto.stroke();

  contexto.fillStyle = '#777980';
  contexto.font = '22px system-ui, sans-serif';
  contexto.fillText('σ', largura - 38, origemY - 12);
  contexto.fillText('τ', origemX + 12, 31);

  if (raioMohr > 0) {
    contexto.strokeStyle = '#168ada';
    contexto.lineWidth = 5;
    contexto.beginPath();
    contexto.arc(x(centroMohr), origemY, raioMohr * escala, 0, Math.PI * 2);
    contexto.stroke();
  }

  const pontoX = x(entradas.sigmaX);
  const pontoY = y(-entradas.tauXY);
  const pontoX2 = x(entradas.sigmaY);
  const pontoY2 = y(entradas.tauXY);

  contexto.strokeStyle = '#656870';
  contexto.lineWidth = 2;
  contexto.setLineDash([8, 8]);
  contexto.beginPath();
  contexto.moveTo(pontoX, pontoY);
  contexto.lineTo(pontoX2, pontoY2);
  contexto.stroke();
  contexto.setLineDash([]);

  const pontos = [
    { x: x(sigma1), y: origemY, cor: '#73beef', rotulo: 'σ₁' },
    { x: x(sigma2), y: origemY, cor: '#73beef', rotulo: 'σ₂' },
    { x: pontoX, y: pontoY, cor: '#ffffff', rotulo: 'X' },
    { x: pontoX2, y: pontoY2, cor: '#ffffff', rotulo: 'Y' },
  ];

  for (const ponto of pontos) {
    contexto.fillStyle = ponto.cor;
    contexto.beginPath();
    contexto.arc(ponto.x, ponto.y, 7, 0, Math.PI * 2);
    contexto.fill();
    contexto.font = '18px system-ui, sans-serif';
    contexto.fillText(ponto.rotulo, ponto.x + 11, ponto.y - 10);
  }

  contexto.fillStyle = '#a2a4aa';
  contexto.font = '17px ui-monospace, monospace';
  contexto.fillText(formatar(sigma2), x(sigma2) - 22, origemY + 35);
  contexto.fillText(formatar(sigma1), x(sigma1) - 22, origemY + 35);
}

function atualizar() {
  erro.hidden = true;

  try {
    const entradas = {
      sigmaX: Number(formulario.elements.sigmaX.value),
      sigmaY: Number(formulario.elements.sigmaY.value),
      tauXY: Number(formulario.elements.tauXY.value),
    };

    const resultado = calcularEstadoPlano(entradas);
    saidas.sigma1.textContent = formatar(resultado.sigma1);
    saidas.sigma2.textContent = formatar(resultado.sigma2);
    saidas.tauMax.textContent = formatar(resultado.tauMax);
    saidas.theta.textContent = `${formatar(resultado.thetaPrincipalGraus)}°`;
    saidas.unidade.textContent = unidade.value;
    desenharCirculo(resultado, entradas);
  } catch (falha) {
    erro.textContent = falha.message;
    erro.hidden = false;
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  atualizar();
});

unidade.addEventListener('change', atualizar);
window.addEventListener('resize', atualizar);
document.querySelector('#year').textContent = new Date().getFullYear();

atualizar();
