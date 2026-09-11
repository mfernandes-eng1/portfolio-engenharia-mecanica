# Murilo Fernandes — Engenharia Mecânica

Portfólio técnico com ferramentas próprias de Engenharia Mecânica.

**Site:** https://mfernandes-eng1.github.io/portfolio-engenharia-mecanica/

## Ferramentas

### 01 — Estado plano de tensão

A calculadora de estado plano de tensão recebe `σx`, `σy` e `τxy` e retorna:

- tensões principais `σ1` e `σ2`;
- tensão máxima de cisalhamento;
- orientação principal;
- representação do círculo de Mohr.

Os cálculos são executados no navegador e não enviam dados a um servidor.

### 02 — Flexão e torção em eixos

Módulo em desenvolvimento para eixo circular maciço, com cálculo de:

- tensão normal de flexão;
- tensão de cisalhamento por torção;
- tensão equivalente de von Mises;
- tensão equivalente de Tresca.

O módulo está disponível em [`eixos.html`](eixos.html).

## Executar localmente

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`.

## Testes

```bash
node --test tests/stress.test.mjs tests/shaft.test.mjs
```

Os testes incluem o caso usado na planilha acadêmica de referência, cisalhamento puro, tensões normais iguais e validação de entradas inválidas. A planilha original e materiais do professor não fazem parte deste repositório.

## Autoria

Idealizado e validado tecnicamente por Murilo Fernandes. Desenvolvido com assistência de inteligência artificial.
