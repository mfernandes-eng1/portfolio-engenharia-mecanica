# Murilo Fernandes — Engenharia Mecânica

Portfólio técnico com ferramentas próprias de Engenharia Mecânica.

## Primeira ferramenta

A calculadora de estado plano de tensão recebe `σx`, `σy` e `τxy` e retorna:

- tensões principais `σ1` e `σ2`;
- tensão máxima de cisalhamento;
- orientação principal;
- representação do círculo de Mohr.

Os cálculos são executados no navegador e não enviam dados a um servidor.

## Executar localmente

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`.

## Testes

```bash
node --test tests/stress.test.mjs
```

Os testes incluem o caso usado na planilha acadêmica de referência, cisalhamento puro, tensões normais iguais e validação de entradas inválidas. A planilha original e materiais do professor não fazem parte deste repositório.

## Autoria

Idealizado e validado tecnicamente por Murilo Fernandes. Desenvolvido com assistência de inteligência artificial.
