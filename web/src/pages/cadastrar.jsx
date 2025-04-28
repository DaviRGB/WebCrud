import React, { useState } from "react";
import {
  validarCPF,
  validarData,
  validarEmail,
  validarNumeroCelular,
  validarRG,
} from "../models/validacao";
import { formatarCPF, formatarTelefone } from "../utils/formatar";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaAddressCard } from "react-icons/fa";
import { AiFillInfoCircle } from "react-icons/ai";

export default function Cadastrar() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [identidadeGenero, setIdentidadeGenero] = useState("");
  const [identidadeRacial, setIdentidadeRacial] = useState("");
  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erros = [];

    if (!validarCPF(cpf)) erros.push("CPF inválido");
    if (!validarEmail(email)) erros.push("E-mail inválido");
    if (!validarNumeroCelular(telefone)) erros.push("Telefone inválido");
    if (!validarRG(rg)) erros.push("Tamanho do RG inválido");
    if (!validarData(dataNascimento)) erros.push("Data de nascimento inválida");
    if (erros.length > 0) {
      setMensagem(erros.join(" · "));
      setIsError(true);
      setTimeout(() => {
        setMensagem("");
        setIsError(false);
      }, 3000);
      return;
    }

    const assistido = {
      nome,
      cpf,
      email,
      telefone,
      rg,
      dataNascimento,
      genero,
      identidadeGenero,
      identidadeRacial,
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
    };

    try {
      const response = await fetch("http://localhost:8080/assistidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistido),
      });
      if (!response.ok) {
        throw new Error("Erro ao cadastrar");
      }
      const data = await response.json();
      console.log("Assistido cadastrado com sucesso!", data);
      setMensagem("Assistido cadastrado com sucesso!");
      setIsError(false);

      setNome("");
      setCpf("");
      setEmail("");
      setTelefone("");
      setRg("");
      setDataNascimento("");
      setGenero("");
      setIdentidadeGenero("");
      setIdentidadeRacial("");
      setEndereco({
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      });
      setTimeout(() => {
        setMensagem("");
        setIsError(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMensagem("Erro ao cadastrar Assistido.");
      setIsError(true);
      setTimeout(() => {
        setMensagem("");
        setIsError(false);
      }, 2000);
    }
  };

  return (
    <Container style={{ marginTop: 40 }}>
      <h2>Incluir Assistido</h2>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-1" style={{ marginTop: 20 }} id="nome-row">
          <Col md={12} className={"mb-3"}>
            <Form.Group controlId="nome">
              <Form.Label>
                <FaAddressCard color="green" /> Nome
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {/*cpf e RG*/}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="cpf">
              <Form.Label>
                <AiFillInfoCircle color="green" /> CPF
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="rg">
              <Form.Label className={"me-lg-2"}> RG </Form.Label>
            </Form.Group>
            <Form.Control
              type="text"
              placeholder="RG"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              required
            />
          </Col>
        </Row>
        {/*//Telefone e E-mail*/}
        <Row>
          <Col md={"6"}>
            <Form.Group controlId="telefone">
              <Form.Label> Telefone </Form.Label>
              <Form.Control
                type="text"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                required
              />
            </Form.Group>
          </Col>
          <Col md={"6"}>
            <Form.Group controlId={"email"}>
              <Form.Label> E-mail </Form.Label>
              <Form.Control
                type="email"
                placeholder="exemple@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row
          className={"mb-2"}
          style={{ marginTop: 20 }}
          id="data-nascimento-row"
        >
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {/*//Sexo, IdentGenero, IdentRacial*/}
        <Row>
          <Col id={"genero-row"}>
            <Form.Group
              className={"mt-0"}
              id="genero-row"
              style={{ marginTop: 20 }}
            >
              <Form.Label>Gênero</Form.Label>
              <Form.Select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              className={"mt-0"}
              id="identidade-genero-row"
              style={{ marginTop: 20 }}
            >
              <Form.Label>Identidade de Gênero</Form.Label>
              <Form.Select
                value={identidadeGenero}
                onChange={(e) => setIdentidadeGenero(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="Cisgênero">Cisgênero</option>
                <option value="Transgênero">Transgênero</option>
                <option value="Não-binário">Não-binário</option>
                <option value="Prefiro Não Informar">
                  Prefiro Não Informar
                </option>
                <option value="Outro">Outro</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              className="mt-0"
              id={"identidade-racial-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Identidade Racial</Form.Label>
              <Form.Select
                value={identidadeRacial}
                onChange={(e) => setIdentidadeRacial(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="Branco">Branco</option>
                <option value="Preta">Preto</option>
                <option value="Pardo">Pardo</option>
                <option value="Amarelo">Amarelo</option>
                <option value="Indígena">Indígena</option>
                <option value="Outro">Outro</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <h5 style={{ marginTop: 30 }}>Endereço</h5>
        {/*//Cep e logradouro*/}
        <Row>
          <Col md={4}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                placeholder="CEP"
                value={endereco.cep}
                onChange={(e) =>
                  setEndereco({ ...endereco, cep: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Logradouro</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rua / Avenida"
                value={endereco.logradouro}
                onChange={(e) =>
                  setEndereco({ ...endereco, logradouro: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {/*//Numero e Complemento*/}
        <Row>
          <Col md={4}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="number"
                placeholder="Número"
                value={endereco.numero}
                onChange={(e) =>
                  setEndereco({ ...endereco, numero: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Complemento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Complemento (opcional)"
                value={endereco.complemento}
                onChange={(e) =>
                  setEndereco({ ...endereco, complemento: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        {/*//Bairro, Estado e Cidade*/}
        <Row>
          <Col md={4}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                placeholder="Bairro"
                value={endereco.bairro}
                onChange={(e) =>
                  setEndereco({ ...endereco, bairro: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Estado"
                value={endereco.estado}
                onChange={(e) =>
                  setEndereco({ ...endereco, estado: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group
              className="mb-3"
              id={"endereco-row"}
              style={{ marginTop: 20 }}
            >
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cidade"
                value={endereco.cidade}
                onChange={(e) =>
                  setEndereco({ ...endereco, cidade: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="success">
          Cadastrar
        </Button>
      </Form>

      {mensagem && (
        <Alert
          variant={isError ? "danger" : "success"}
          style={{ marginTop: 20 }}
        >
          {mensagem}
        </Alert>
      )}
    </Container>
  );
}
