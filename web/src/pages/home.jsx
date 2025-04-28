import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

export default function Home() {
  const [comunicados, setComunicados] = useState([]);
  const [legenda, setLegenda] = useState("");
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarComunicados();
  }, []);

  const buscarComunicados = async () => {
    try {
      const response = await fetch("http://localhost:8080/comunicados");
      const data = await response.json();
      setComunicados(data);
    } catch (error) {
      console.error("Erro ao buscar comunicados", error);
    }
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("legenda", legenda);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await fetch("http://localhost:8080/comunicados", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMensagem("Comunicado adicionado com sucesso!");
        setLegenda("");
        setImagem(null);
        buscarComunicados();
      } else {
        setMensagem("Erro ao adicionar comunicado");
      }
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao adicionar comunicado");
    }

    setTimeout(() => setMensagem(""), 3000);
  };

  const handleEditarLegenda = async (comunicado) => {
    const novaLegenda = prompt("Digite a nova legenda:", comunicado.legenda);
    if (novaLegenda !== null) {
      try {
        const formData = new FormData();
        formData.append("legenda", novaLegenda);

        const response = await fetch(
          `http://localhost:8080/comunicados/${comunicado.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (response.ok) {
          setMensagem("Legenda atualizada com sucesso!");
          buscarComunicados();
        } else {
          setMensagem("Erro ao atualizar legenda");
        }
      } catch (error) {
        console.error("Erro ao atualizar legenda", error);
        setMensagem("Erro ao atualizar legenda");
      }
      setTimeout(() => setMensagem(""), 3000);
    }
  };

  const handleExcluir = async (id) => {
    const confirmado = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmado) return;

    try {
      const response = await fetch(`http://localhost:8080/comunicados/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        buscarComunicados();
        setMensagem("Comunicado deletado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao excluir comunicado", error);
      setMensagem("Erro ao excluir comunicado");
    }

    setTimeout(() => setMensagem(""), 3000);
  };

  return (
    <Container style={{ marginTop: 40 }}>
      <h2>Comunicados</h2>

      <Form onSubmit={handleAdicionar}>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Legenda"
              value={legenda}
              onChange={(e) => setLegenda(e.target.value)}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files[0])}
            />
          </Col>
        </Row>
        <Button type="submit" variant="success">
          Publicar
        </Button>
      </Form>

      {mensagem && (
        <Alert variant="success" className="mt-3">
          {mensagem}
        </Alert>
      )}

      <Row className="mt-4">
        {comunicados.length > 0 ? (
          comunicados.map((item) => (
            <Col md={4} key={item.id} className="mb-3">
              <div className="comunicado p-2 border rounded">
                {item.imagem && (
                  <img
                    src={`http://localhost:8080/uploads/${item.imagem}`}
                    alt="Comunicado"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <p>
                  <strong>Legenda:</strong> {item.legenda}
                </p>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleExcluir(item.id)}
                  >
                    Deletar
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditarLegenda(item)}
                  >
                    Editar Legenda
                  </Button>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <p className="text-muted">Nenhum comunicado ainda.</p>
        )}
      </Row>
    </Container>
  );
}
