import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
import { FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatarCPF } from "../utils/formatar";
import { excluirAssistido } from "./excluir";

export default function Listar() {
  const [lista, setLista] = useState([]);
  const [dp, setdp] = useState([]);
  const [naoTem, setNaoTem] = useState(false);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCPF, setFiltroCPF] = useState("");
  const [cpfValid, setCpfValid] = useState(true);

  useEffect(() => {
    async function buscarAssistidos() {
      try {
        const response = await fetch("http://localhost:8080/assistidos");
        const data = await response.json();
        setdp(data);
        setLista(data);
      } catch (error) {
        console.error("Erro ao busca assistidos", error);
      }
    }
    buscarAssistidos();
  }, []);

  const handleCpfChange = (e) => {
    const res = formatarCPF(e.target.value);
    setFiltroCPF(res);

    const verificar = res.replace(/\D/g, "");
    if (verificar.length > 0 && verificar.length < 11) {
      setCpfValid(false);
    } else {
      setCpfValid(true);
    }
  };

  const handlePesquisar = (e) => {
    e.preventDefault();
    let array = dp;

    if (filtroCPF.length > 0 && filtroCPF.replace(/\D/g, "").length !== 11) {
      setCpfValid(false);
      setLista([]);
      setNaoTem(true);
      setTimeout(() => setNaoTem(false), 3000);
      return;
    }
    setCpfValid(true);

    if (filtroCPF.length === 14) {
      array = dp.filter((item) => item.cpf === filtroCPF);
    }

    if (filtroNome.trim().length > 0) {
      array = array.filter((item) =>
        item.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }
    setLista(array);

    if (array.length === 0) {
      setNaoTem(true);
      setTimeout(() => setNaoTem(false), 3000);
    }
  };

  const handlelimpar = (e) => {
    e.preventDefault();
    setFiltroNome("");
    setFiltroCPF("");
    setCpfValid(true);
    setLista(dp);
  };

  const navigate = useNavigate();

  const handleNovo = () => {
    navigate("/cadastrar");
  };

  const handleExcluir = async (cpf) => {
    const confirmado = window.confirm(
      "Tem certeza que deseja excluir este assistido?"
    );
    if (confirmado) {
      const sucesso = await excluirAssistido(cpf);
      if (sucesso) {
        const novaLista = dp.filter((a) => a.cpf !== cpf);
        setdp(novaLista);
        setLista(novaLista);
      }
    }
  };

  // const handleExcluir = async (cpf) => {
  //     const confirmado = window.confirm(
  //         "Tem certeza que deseja excluir este assistido?"
  //     );
  //     if (confirmado) {
  //         try {
  //             await fetch(`http://localhost:8080/assistidos/${cpf}`, {
  //                 method: "DELETE",
  //             });
  //             const novaLista = dp.filter((a) => a.cpf !== cpf);
  //             setdp(novaLista);
  //             setLista(novaLista);
  //         } catch (error) {
  //             console.error("Erro ao excluir assistido", error);
  //         }
  //
  //     }
  // };

  return (
    <Container style={{ marginTop: 40 }}>
      <h2>Lista de Assistidos</h2>

      <Form onSubmit={handlePesquisar} noValidate>
        <Form.Group className={"mb-3"}>
          <Form.Label> Nome </Form.Label>
          <Form.Control
            type="text"
            placeholder="Filtrar por Nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className={"me-2"}
          />
        </Form.Group>

        <Form.Group className={"mb-3"}>
          <Form.Label className={"mb-2"}> CPF </Form.Label>
          <Form.Control
            type="text"
            placeholder="Filtrar por CPF"
            value={filtroCPF}
            onChange={handleCpfChange}
            isInvalid={!cpfValid}
          />
          <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex mb-3">
          <Button variant="success" type="submit" className="me-2">
            Pesquisar
          </Button>
          <Button
            variant="success"
            type="reset"
            className={"me-2"}
            onClick={handlelimpar}
          >
            Limpar
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={handleNovo}
            className={"me-2"}
          >
            Novo
          </Button>
        </div>
      </Form>

      {!lista.length && naoTem && (
        <Alert variant="secondary">Nenhum assistido encontrado!</Alert>
      )}

      {lista.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Telefone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((item) => (
              <tr key={item.cpf}>
                <td>{item.nome}</td>
                <td>{item.cpf}</td>
                <td>{item.email}</td>
                <td>{item.telefone}</td>
                <td style={{ display: "flex", justifyContent: "space-evenly" }}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => navigate(`/visualizar?cpf=${item.cpf}`)}
                    className="me-2"
                  >
                    <FaSearch />
                  </Button>

                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => navigate(`/editar?cpf=${item.cpf}`)}
                    className="me-2"
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleExcluir(item.cpf)}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
