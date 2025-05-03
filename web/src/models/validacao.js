export function validarCpfUnico(cpf, assistidosArray) {
  return !assistidosArray.some((a) => a.cpf === cpf);
}

export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) {
    return false;
  }

  if(cpf.length === 11 && /^\d{11}$/.test(cpf) && new Set(cpf).size === 1) {
    return false;
  }
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += (cpf[i] - "0") * (10 - i);
  }
  let primeiroDigito = 11 - (soma % 11);
  if (primeiroDigito == 10 || primeiroDigito == 11) {
    primeiroDigito = 0;
  }
  if (cpf[9] - "0" != primeiroDigito) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += (cpf[i] - "0") * (11 - i);
  }
  let segundoDigito = 11 - (soma % 11);
  if (segundoDigito == 10 || segundoDigito == 11) {
    segundoDigito = 0;
  }
  if (cpf[10] - "0" != segundoDigito) {
    return false;
  }
  return true;
}


export function validarEmail(email) {
  const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return pattern.test(email);
}

export function validarNumeroCelular(numero) {

  const valor = numero.replace(/\D/g, "");
 if(valor.length !== 11) return false;

  const pattern = /^\(\d{2}\)\s\d{5}-\d{4}$/;
  return pattern.test(numero);
}

export function validarRG(rg) {
  rg = rg.replace(/\D/g, "");
  return rg.length >= 7 && rg.length <= 9;
}

export  function validarData(dataStr) {
  const data = new Date(dataStr);
  const ano = data.getFullYear();

  if (isNaN(data.getTime())) {
    return false;
  }

  if (ano < 1800 || ano > 2100) {
    return false;
  }
  return true;
}

export const validarCep = (cep) => {
  const soNumeros = cep.replace(/\D/g, '');
  return soNumeros.length === 8;
};