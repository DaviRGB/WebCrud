import { pool } from "../config/database.js";

export async function create(req, res) {
  const {
    nome,
    cpf,
    email,
    telefone,
    rg,
    dataNascimento,
    genero,
    identidadeGenero,
    identidadeRacial,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  try {
    const dataNascimentoF = new Date(dataNascimento)
      .toISOString()
      .split("T")[0];
    const query = `
            INSERT INTO assistidos (
                nome, cpf, email, telefone, rg, data_nascimento, genero,
                identidade_genero, identidade_racial, cep, logradouro, numero,
                complemento, bairro, cidade, estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                RETURNING *;
        `;

    const values = [
      nome,
      cpf,
      email,
      telefone,
      rg,
      dataNascimentoF,
      genero,
      identidadeGenero,
      identidadeRacial,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    ];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar assistido");
  }
}

export async function findAll(req, res) {
  try {
    const query = `
            SELECT * FROM assistidos;
        `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao listar assistidos");
  }
}

export async function findByCPF(req, res) {
  const { cpf } = req.params;
  try {
    const query = "SELECT * FROM assistidos WHERE cpf = $1;";
    const result = await pool.query(query, [cpf]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .send("Nenhum assistido encontrado com o CPF informado");
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}

export async function updateAssistido(req, res) {
  const { cpf } = req.params;
  const {
    nome,
    cpf: novoCpf,
    email,
    telefone,
    rg,
    dataNascimento,
    genero,
    identidadeGenero,
    identidadeRacial,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  try {
    const dataFormatada = new Date(dataNascimento).toISOString().split("T")[0];

    const query = `
            UPDATE assistidos SET
            nome = $1,
            cpf = $2,
            email = $3,
            telefone = $4,
            rg = $5,
            data_nascimento = $6,
            genero = $7,
            identidade_genero = $8,
            identidade_racial = $9,
            cep = $10,
            logradouro = $11,
            numero = $12,
            complemento = $13,
            bairro = $14,
            cidade = $15,
            estado = $16
            WHERE cpf = $17
                RETURNING *;
        `;

    const values = [
      nome,
      novoCpf || cpf,
      email,
      telefone,
      rg,
      dataFormatada,
      genero,
      identidadeGenero,
      identidadeRacial,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cpf,
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .send("Nenhum assistido encontrado para atualização");
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}

export async function deletar(req, res) {
  const { cpf } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM assistidos WHERE cpf = $1 RETURNING *;",
      [cpf]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Nenhum assistido encontrado para exclusão");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
}
