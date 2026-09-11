import { calcularTensoesEixo } from './shaft.mjs';

const formulario = document.querySelector('#shaft-form');
const erro = document.querySelector('#shaft-error');
const saidas = {
  flexao: document.querySelector('#shaft-sigma'),
  torcao: document.querySelector('#shaft-tau'),
  vonMises: document.querySelector('#shaft-vm'),
  tresca: document.querySelector('#shaft-tresca'),
};

const formatador = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 3,
  minimumFractionDigits: 0,
});

function atualizar() {
  erro.hidden = true;

  try {
    const resultado = calcularTensoesEixo({
      momento: Number(formulario.elements.momento.value),
      torque: Number(formulario.elements.torque.value),
      diametro: Number(formulario.elements.diametro.value),
    });

    saidas.flexao.textContent = formatador.format(resultado.tensaoFlexao);
    saidas.torcao.textContent = formatador.format(resultado.tensaoTorcao);
    saidas.vonMises.textContent = formatador.format(resultado.vonMises);
    saidas.tresca.textContent = formatador.format(resultado.tresca);
  } catch (falha) {
    erro.textContent = falha.message;
    erro.hidden = false;
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  atualizar();
});

document.querySelector('#year').textContent = new Date().getFullYear();
atualizar();
