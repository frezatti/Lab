export class Filme {
    constructor(id, titulo, descricao, genero, classificacao, duracao, dataEstreia) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.classificacao = classificacao;
        this.duracao = duracao;
        this.dataEstreia = dataEstreia;
    }

    // Getters
    getId() {
        return this.id;
    }

    getTitulo() {
        return this.titulo;
    }

    getDescricao() {
        return this.descricao;
    }

    getGenero() {
        return this.genero;
    }

    getClassificacao() {
        return this.classificacao;
    }

    getDuracao() {
        return this.duracao;
    }

    getDataEstreia() {
        return this.dataEstreia;
    }

    //Setters

    setId(id) {
        this.id = id;
    }

    setTitulo(titulo) {
        this.titulo = titulo;
    }

    setDescricao(descricao) {
        this.descricao = descricao;
    }

    setGenero(genero) {
        this.genero = genero;
    }

    setClassificacao(classificacao) {
        this.classificacao = classificacao;
    }

    setDuracao(duracao) {
        this.duracao = duracao;
    }

    setDataEstreia(dataEstreia) {
        this.dataEstreia = dataEstreia;
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            descricao: this.descricao,
            genero: this.genero,
            classificacao: this.classificacao,
            duracao: this.duracao,
            dataEstreia: this.dataEstreia
        };
    }

    toString() {
        return `Filme: ${this.titulo} (${this.genero}) - Classificação: ${this.classificacao} anos - Duração: ${this.duracao}h - Estreia: ${this.formatarData(this.dataEstreia)}`;
    }

    formatarData(data) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR");
    }

    // Factory method
    static fromJSON(json) {
        return new Filme(
            json.id,
            json.titulo,
            json.descricao,
            json.genero,
            json.classificacao,
            json.duracao,
            json.dataEstreia
        );
    }
}
