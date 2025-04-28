import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function Home() {
  const [comunicados, setComunicados] = useState([]);
  const [legenda, setLegenda] = useState("");
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [AniVerMEs, setAniVerMEs] = useState([]);

  useEffect(() => {
    comuni();
    Aniver();
  }, []);


  const comuni = async () => {
    try {
      const response = await fetch("http://localhost:8080/comunicados");
      const data = await response.json();
      setComunicados(data);
    } catch (error) {
      console.error("Erro ao buscar comunicados", error);
    }
  };

  const Aniver = async () => {
    try {
      const response = await fetch("http://localhost:8080/assistidos");

      const data = await response.json();
      const mesAtual = new Date().getMonth() + 1;
      const filtrados = data.filter((a) => {
        if (!a.data_nascimento) return false;
        const data = new Date(a.data_nascimento);
        return data.getMonth() + 1 === mesAtual;
      });
      setAniVerMEs(filtrados);
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
        comuni();
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
          comuni();
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
        comuni();
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
            <Col md={6} key={item.id} className="mb-3">
              <div className="comunicado p-4">
                {item.imagem && (
                  <img
                    src={`http://localhost:8080/uploads/${item.imagem}`}
                    alt="Comunicado"
                    style={{
                      width: "90%",
                      height: "280px",
                      objectFit: "cover",
                      marginBottom: "10px",
                      marginLeft: "-3%",
                    }}
                  />
                )}
                <p>
                  <strong>Legenda:</strong> {item.legenda}
                </p>

                <div className="d-flex justify-content-center gap-2 mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExcluir(item.id)}
                  >
                    Deletar
                  </Button>
                  <Button
                    variant="success"
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
          <Alert
            variant="success"
            style={{
              maxWidth: "400px",
              margin: "20px auto",
              textAlign: "center",
            }}
          >
            Nenhum comunicado ainda.
          </Alert>
        )}
      </Row>

      <h2 className="mt-5">Aniversariantes do Mês</h2>

      <Row className="mt-3">
        {AniVerMEs.length > 0 ? (
          AniVerMEs.map((item) => (
            <Col key={item.id} md={3} sm={6} xs={12} className="mb-4">
              <div
                className="text-center p-3 shadow-sm rounded"
                style={{
                  border: "1px solid #ccc",
                  height: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {item.foto ? (
                  <img
                    src={`http://localhost:8080/uploads/${item.foto}`}
                    alt="Foto do assistido"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <FaUserCircle size={80} color="#ccc" />
                )}
                <h5 className="mt-3">{item.nome}</h5>
                <small>
                  {new Date(item.data_nascimento).toLocaleDateString()}
                </small>
              </div>
            </Col>
          ))
        ) : (
          <Alert
            variant="success"
            style={{
              maxWidth: "400px",
              margin: "20px auto",
              textAlign: "center",
            }}
          >
            Nenhum aniversariante encontrado este mês.
          </Alert>
        )}
      </Row>
    </Container>
  );
}
