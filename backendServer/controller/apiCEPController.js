import express from "express";

const router = express.Router();

router.get("/cep/:cep", async (req, res) => {
  const cep = req.params.cep.replace("-", "");
  if (cep.length !== 8) {
    return res.status(400).json({ error: "CEP inválido" });
  }
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error("Não foi possível realizar a busca do CEP informado");
    }
    const valores = await response.json();
    if (valores.erro) {
      return res.status(404).json({ error: "CEP não encontrado" });
    }
    res.json({
      logradouro: valores.logradouro,
      numero: "",
      complemento: valores.complemento,
      bairro: valores.bairro,
      cidade: valores.localidade,
      estado: valores.uf,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao buscar o CEP" });
  }
});

export default router;
