import express from "express";
import multer from "multer";
import { pool } from "../config/database.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("imagem"), async (req, res) => {
  const { legenda } = req.body;
  const imagem = req.file ? req.file.filename : null;

  try {
    const query = `
      INSERT INTO comunicados (imagem, legenda)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [imagem, legenda];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar comunicado");
  }
});

router.get("/", async (req, res) => {
  try {
    const query = `SELECT * FROM comunicados ORDER BY data_publicacao DESC;`;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar comunicados");
  }
});

router.patch("/:id", upload.single("imagem"), async (req, res) => {
  const { id } = req.params;
  const { legenda } = req.body;
  const imagem = req.file ? req.file.filename : null;

  try {
    let querry;
    let valores;
    if (imagem) {
      querry = `UPDATE comunicados SET imagem = $1, legenda = $2 WHERE id = $3 RETURNING *;`;
      valores = [imagem, legenda, id];
    } else {
      querry = `UPDATE comunicados SET legenda = $1 WHERE id = $2 RETURNING *;`;
      valores = [legenda, id];
    }
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
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT imagem FROM comunicados WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Nenhuma imagem encontrada para excluir");
    }

    const imagem = result.rows[0].imagem;
    await pool.query('DELETE FROM comunicados WHERE id = $1', [id]);

    if (imagem) {
      const caminhoImagem = path.join('uploads', imagem);
      fs.unlink(caminhoImagem, (err) => {
        if (err) {
          console.error('Erro ao deletar imagem:', err);
        } else {
          console.log('Imagem deletada com sucesso.');
        }
      });
    }

    res.status(204).send("Exclusão realizada com sucesso");
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao excluir imagem');
  }
});

export default router;
