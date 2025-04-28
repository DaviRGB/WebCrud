import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Defensoria",
  password: "1234",
  port: 5432,
});

export async function createTables() {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS assistidos(
            id                SERIAL PRIMARY KEY,
            nome              VARCHAR(255)       NOT NULL,
            cpf               VARCHAR(14) UNIQUE NOT NULL,
            email             VARCHAR(255),
            telefone          VARCHAR(20) NOT NULL,
            rg                VARCHAR(20),
            data_nascimento   DATE NOT NULL,
            genero            VARCHAR(50) NOT NULL,
            identidade_genero VARCHAR(50) NOT NULL,
            identidade_racial VARCHAR(50) NOT NULL,
            cep               VARCHAR(10) NOT NULL,
            logradouro        VARCHAR(255) NOT NULL,
            numero            INT,
            complemento       VARCHAR(255),
            bairro            VARCHAR(255) NOT NULL,
            cidade            VARCHAR(255) NOT NULL,
            estado            VARCHAR(50)  NOT NULL
        );

        CREATE TABLE IF NOT EXISTS comunicados (
            id SERIAL PRIMARY KEY,
            imagem TEXT,
            legenda TEXT NOT NULL,
            data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}
