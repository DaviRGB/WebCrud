import {Assistido} from "./Assistido.js";

export class DefensoriaPublica {
  constructor() {
    const salvos = localStorage.getItem("assistidos");
    this.assistidos = salvos ? JSON.parse(salvos) : [];
  }

  salvarLocalStorage() {
    localStorage.setItem("assistidos", JSON.stringify(this.assistidos));
  }

  cadastroDeAssistidos(
      nome,
      cpf,
      email,
      endereco,
      telefone,
      idade,
      rg,
      dataNascimento,
      genero,
      identidadeGenero,
      identidadeRacial
  ) {
    const novoAssistido = new Assistido(
        nome,
        cpf,
        email,
        endereco,
        telefone,
        idade,
        rg,
        dataNascimento,
        genero,
        identidadeGenero,
        identidadeRacial
    );
    this.assistidos.push(novoAssistido);
    this.salvarLocalStorage();
  }

  consultarAssistidoCPF(cpf) {
    return this.assistidos.filter(item => item.cpf.includes(cpf));
  }

  BuscarAssitido(cpf) {
    const assist = this.assistidos.find(item => item.cpf === cpf);
    return assist ? assist : null;
  }

  editarAssistido(
      cpfAntigo,
      { nome, telefone, rg, idade, email, endereco, cpfNovo, dataNascimento, genero, identidadeGenero, identidadeRacial }
  ) {
    const index = this.search(cpfAntigo);
    if (index === -1) return false;

    const assist = this.assistidos[index];

    if (cpfNovo !== undefined) assist.cpf = cpfNovo;
    if (nome !== undefined) assist.nome = nome;
    if (telefone !== undefined) assist.telefone = telefone;
    if (rg !== undefined) assist.rg = rg;
    if (idade !== undefined) assist.idade = idade;
    if (email !== undefined) assist.email = email;
    if (endereco !== undefined) {
      assist.endereco = {
        ...assist.endereco,
        ...endereco
      };
    }
    if (dataNascimento !== undefined) assist.dataNascimento = dataNascimento;
    if (genero !== undefined) assist.genero = genero;
    if (identidadeGenero !== undefined) assist.identidadeGenero = identidadeGenero;
    if (identidadeRacial !== undefined) assist.identidadeRacial = identidadeRacial;

    this.salvarLocalStorage();
    return true;
  }

  excluirAssistido(cpf) {
    const index = this.search(cpf);
    if (index !== -1) {
      this.assistidos.splice(index, 1);
      this.salvarLocalStorage();
    }
  }

  search(cpf) {
    return this.assistidos.findIndex(item => item.cpf === cpf);
  }

  imprimeTest() {
    this.assistidos.forEach(item => {
      console.log(item.nome);
    });
  }
}