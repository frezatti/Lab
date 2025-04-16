export class Sala {
    constructor(id, nome, capacidade, tipo) {
        this.id = id;
        this.nome = nome;
        this.capacidade = capacidade;
        this.tipo = tipo;
    }

    // Getters
    getId() {
        return this.id;
    }

    getNome() {
        return this.nome;
    }

    getCapacidade() {
        return this.capacidade;
    }

    getTipo() {
        return this.tipo;
    }

    // Setters
    setId(id) {
        this.id = id;
    }

    setNome(nome) {
        this.nome = nome;
    }

    setCapacidade(capacidade) {
        this.capacidade = capacidade;
    }

    setTipo(tipo) {
        this.tipo = tipo;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            capacidade: this.capacidade,
            tipo: this.tipo
        };
    }

    toString() {
        return `Sala: ${this.nome} (Tipo: ${this.tipo}, Capacidade: ${this.capacidade} lugares)`;
    }

    static fromJSON(json) {
        return new Sala(json.id, json.nome, json.capacidade, json.tipo);
    }
}
