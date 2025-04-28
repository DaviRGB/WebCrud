export function limparTexto(texto) {
  return texto.trim();
}

export const formatarCPF = (valor) => {
  const dig = valor.replace(/\D/g, "").slice(0, 11);
  return dig
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatarTelefone = (valor) => {
  const dig = valor.replace(/\D/g, "").slice(0, 11);
  return dig
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/^(\(\d{2}\)\s\d{5})(\d)/g,"$1-$2");
};

export const FormataRG = (valor) => {
  return valor.replace(/\D/g, "").slice(0, 9);
}