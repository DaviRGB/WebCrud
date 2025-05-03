export async function BuscaApiCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        throw new Error("CEP inválido");
    }

    const response = await fetch(`http://localhost:8080/cep/${cepLimpo}`);
    if (!response.ok) {
        throw new Error("Erro ao buscar o CEP");
    }

    const dados = await response.json();

    if (dados.error) {
        throw new Error("CEP não encontrado");
    }

    return dados;
}