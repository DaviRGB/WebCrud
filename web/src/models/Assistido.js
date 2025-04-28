export class Assistido {
  constructor(nome, cpf, email, telefone, rg, dataNascimento, genero, identidadeGenero, identidadeRacial, endereco) {
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.telefone = telefone;
    this.rg = rg;
    this.dataNascimento = dataNascimento;
    this.genero = genero;
    this.identidadeGenero = identidadeGenero;
    this.identidadeRacial = identidadeRacial;
    this.endereco = endereco;
  }

  getNome() {
    return this.nome;
  }
  setNome(novoNome) {
    this.nome = novoNome;
  }

  getCPF() {
    return this.cpf;
  }

  getTelefone() {
    return this.telefone;
  }
  setTelefone(novoTelefone) {
    this.telefone = novoTelefone;
  }
  getEmail() {
    return this.email;
  }
  setEmail(novoEmail) {
    this.email = novoEmail;
  }

  getRG() {
    return this.rg;
  }
  setRG(novoRG) {
    this.rg = novoRG;
  }

  getDataNascimento() {
    return this.dataNascimento;
  }
  setDataNascimento(data) {
    this.dataNascimento = data;
  }

  getGenero() {
    return this.genero;
  }
  setGenero(novoGenero) {
    this.genero = novoGenero;
  }

  getIdentidadeGenero() {
    return this.identidadeGenero;
  }
  setIdentidadeGenero(novaIdentidade) {
    this.identidadeGenero = novaIdentidade;
  }

  getIdentidadeRacial() {
    return this.identidadeRacial;
  }
  setIdentidadeRacial(novaIdentidadeRacial) {
    this.identidadeRacial = novaIdentidadeRacial;
  }

  getEndereco() {
    return this.endereco;
  }
  setEndereco(novoEndereco) {
    this.endereco = novoEndereco;
  }
}