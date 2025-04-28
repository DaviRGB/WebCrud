import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {limparTexto} from "../utils/formatar";

export default function Visualizar() {
  const [searchParams] = useSearchParams();
  const cpfBusca = searchParams.get("cpf");

  const [assistido, setAssistido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function Visualizar() {
      try {
        const response = await fetch(`http://localhost:8080/assistidos/${cpfBusca}`);
        if (!response.ok) {
          throw new Error("Assistido não encontrado");
        }
        const data = await response.json();
        setAssistido(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (cpfBusca) {
      Visualizar();
    }
  }, [cpfBusca]);

  const handleVoltar = () => {
    navigate("/lista");
  };

  if (loading) {
    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spinner animation="border" variant="success" />
        </div>
    );
  }

  if (error || !assistido) {
    return (
        <Container style={{ marginTop: 40 }}>
          <Alert variant="danger">Assistido não encontrado</Alert>
          <Button variant="secondary" onClick={handleVoltar}>
            Voltar
          </Button>
        </Container>
    );
  }

  return (
      <Container style={{ marginTop: 40 }}>
        <h2>Visualizar Assistido</h2>

        <Form>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group className="mb-3" controlId="nome" style={{ marginTop: 20 }}>
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" value={assistido.nome} readOnly disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2" controlId="cpf" style={{ marginTop: 10 }}>
                <Form.Label>CPF</Form.Label>
                <Form.Control type="text" value={assistido.cpf} readOnly disabled />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-2" style={{ marginTop: 10 }}>
              <Form.Group>
                <Form.Label>RG</Form.Label>
                <Form.Control type="text" value={assistido.rg} readOnly disabled />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Telefone</Form.Label>
                <Form.Control type="text" value={assistido.telefone} readOnly disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={assistido.email} readOnly disabled />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control type="date" value={assistido.data_nascimento?.split('T')[0] || ""} readOnly disabled />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Gênero</Form.Label>
                <Form.Control type="text" value={assistido.genero} readOnly disabled />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Identidade de Gênero</Form.Label>
                <Form.Control type="text" value={assistido.identidade_genero} readOnly disabled />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Identidade Racial</Form.Label>
                <Form.Control type="text" value={assistido.identidade_racial} readOnly disabled />
              </Form.Group>
            </Col>
          </Row>

        {/* Endereço */}
        <h5 style={{ marginTop: 30 }}>Endereço</h5>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>CEP</Form.Label>
                    <Form.Control type="text" value={assistido.cep} readOnly disabled />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Logradouro</Form.Label>
                    <Form.Control type="text" value={assistido.logradouro} readOnly disabled />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Número</Form.Label>
                    <Form.Control type="text" value={assistido.numero} readOnly disabled />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Complemento</Form.Label>
                    <Form.Control type="text" value={assistido.complemento} readOnly disabled />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control type="text" value={assistido.bairro} readOnly disabled />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Estado</Form.Label>
                    <Form.Control type="text" value={assistido.estado} readOnly disabled />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control type="text" value={assistido.cidade} readOnly disabled />
                  </Form.Group>
                </Col>
              </Row>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleVoltar}>
              Voltar
            </Button>
          </div>
        </Form>
      </Container>
  );
}