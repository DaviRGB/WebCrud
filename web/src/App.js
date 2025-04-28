import "./styles.css";
import React from "react";
import {DefensoriaPublica} from "./models/DefensoriaPublica";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";

import Home from "./pages/home";
import Cadastrar from "./pages/cadastrar";
// import Excluir from "./pages/excluir";
import RH from "./pages/lista";
import Editar from "./pages/Editar";
import Visualizar from "./pages/Visualizar";
// const dp = new DefensoriaPublica();
import {Image, Nav, Navbar} from "react-bootstrap";
import logo from "./logo.svg";

export default function App() {
  return (
      <BrowserRouter>
        <Navbar expand="md" sticky="top" className="bg-body-secondary px-5">
          <Navbar.Brand href="/">
            <Image src={logo} width={140} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav variant="underline">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/cadastrar">Cadastrar</Nav.Link>
              <Nav.Link href="/lista">RH</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

    <Routes>
      <Route path="/" element={< Home />}/>
      <Route path="/lista" element={< RH />}/>
      <Route path="/Editar" element={< Editar />}/>
      <Route path="/cadastrar" element={< Cadastrar />}/>
      <Route path="/visualizar" element={< Visualizar />}/>
    </Routes>
    </BrowserRouter>
  );
}