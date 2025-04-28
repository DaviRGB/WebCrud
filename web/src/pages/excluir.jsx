export async function excluirAssistido(cpf) {
    try {
        const response = await fetch(`http://localhost:8080/assistidos/${cpf}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir assistido");
        }

        return true;
    } catch (error) {
        console.error("Erro ao excluir assistido:", error);
        return false;
    }
}