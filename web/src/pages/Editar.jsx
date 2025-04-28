import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validarCPF, validarEmail, validarNumeroCelular, validarRG, } from "../models/validacao";
import { formatarCEP, formatarCPF, FormataRG, formatarTelefone, limparTexto, } from "../utils/formatar";
import { Alert, Button, Col, Container, Form, Row, Spinner, } from "react-bootstrap";
import { FaAddressCard } from "react-icons/fa";
import { AiFillInfoCircle } from "react-icons/ai";
import { BuscaApiCep } from "../utils/cep";

export default function Editar() {
  const [searchParams] = useSearchParams();
  const cpfBusca = searchParams.get("cpf");

  const [assistido, setAssistido] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (cpfBusca) {
      buscar(cpfBusca);
    }
  }, [cpfBusca]);

  const buscar = async (cpf) => {
    try {
      const response = await fetch(`http://localhost:8080/assistidos/${cpf}`);
      if (!response.ok) throw new Error("Não encontrado");

      const data = await response.json();
      setAssistido(data);
      setNome(data.nome);
      setCpf(data.cpf);
      setEmail(data.email);
      setTelefone(data.telefone);
      setRg(data.rg);
      setDataNascimento(data.data_nascimento.split("T")[0]);
      setGenero(data.genero);
      setIdentidadeGenero(data.identidade_genero);
      setIdentidadeRacial(data.identidade_racial);
      setEndereco({
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
      });
    } catch (error) {
      setMensagem("Assistido não encontrado.");
      setIsError(true);
      setTimeout(() => setMensagem(""), 1000);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    const erros = [];

    if (email && !validarEmail(limparTexto(email)))
      erros.push("E-mail inválido");
    if (telefone && !validarNumeroCelular(limparTexto(telefone)))
      erros.push("Telefone inválido");
    if (cpf && !validarCPF(limparTexto(cpf))) erros.push("CPF inválido");
    if (rg && !validarRG(limparTexto(rg))) erros.push("Tamanho do RG inválido");

    if (erros.length > 0) {
      setMensagem(erros.join(" · "));
      setIsError(true);
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/assistidos/${cpfBusca}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nome: limparTexto(nome),
            novoCpf: limparTexto(cpf),
            email: limparTexto(email),
            telefone: limparTexto(telefone),
            rg: limparTexto(rg),
            dataNascimento: limparTexto(dataNascimento),
            genero: limparTexto(genero),
            identidadeGenero: limparTexto(identidadeGenero),
            identidadeRacial: limparTexto(identidadeRacial),
            cep: limparTexto(endereco.cep),
            logradouro: limparTexto(endereco.logradouro),
            numero: endereco.numero,
            complemento: limparTexto(endereco.complemento),
            bairro: limparTexto(endereco.bairro),
            cidade: limparTexto(endereco.cidade),
            estado: limparTexto(endereco.estado),
          }),
        }
      );

      if (!response.ok) throw new Error("Falha ao editar");

      setMensagem("Assistido editado com sucesso.");
      setIsError(false);
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      setMensagem("Falha ao editar.");
      setIsError(true);
    }
  };

  const buscarCep = async () => {
    try {
      const dados = await BuscaApiCep(endereco.cep);
      setEndereco((Antigo) => ({
        ...Antigo,
        logradouro: dados.logradouro || Antigo.logradouro,
        bairro: dados.bairro || Antigo.bairro,
        cidade: dados.cidade || Antigo.cidade,
        estado: dados.estado || Antigo.estado,
        complemento: dados.complemento || Antigo.complemento,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const navigate = useNavigate();
  const handleCancelar = () => {
    navigate("/lista");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <Container style={{ marginTop: 40 }}>
      <h2>Editar Assistido</h2>

      {assistido ? (
        <Form>
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
                onChange={(e) => setRg(FormataRG(e.target.value))}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={"6"}>
              <Form.Group controlId="telefone">
                <Form.Label> Telefone </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="(99) 99999-9999"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(formatarTelefone(e.target.value))
                  }
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
                  placeholder="74000-000"
                  value={endereco.cep}
                  onChange={(e) =>
                    setEndereco({
                      ...endereco,
                      cep: formatarCEP(e.target.value),
                    })
                  }
                  onBlur={buscarCep}
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
          <div
            style={{ marginTop: 20 }}
            className={"d-flex justify-content-between"}
          >
            <Button variant="success" onClick={salvar}>
              Salvar alterações
            </Button>

            <Button variant="secondary" onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </Form>
      ) : (
        !assistido && (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Spinner animation="border" variant="success" />
          </div>
        )
      )}

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
