export class Sessao {
    constructor(id, filmeId, salaId, dataHora, preco, idioma, formato) {
        this.id = id;
        this.filmeId = filmeId;
        this.salaId = salaId;
        this.dataHora = dataHora;
        this.preco = preco;
        this.idioma = idioma;
        this.formato = formato;
    }

    // Getters
    getId() {
        return this.id;
    }

    getFilmeId() {
        return this.filmeId;
    }

    getSalaId() {
        return this.salaId;
    }

    getDataHora() {
        return this.dataHora;
    }

    getPreco() {
        return this.preco;
    }

    getIdioma() {
        return this.idioma;
    }

    getFormato() {
        return this.formato;
    }

    // Setters
    setId(id) {
        this.id = id;
    }

    setFilmeId(filmeId) {
        this.filmeId = filmeId;
    }

    setSalaId(salaId) {
        this.salaId = salaId;
    }

    setDataHora(dataHora) {
        this.dataHora = dataHora;
    }

    setPreco(preco) {
        this.preco = preco;
    }

    setIdioma(idioma) {
        this.idioma = idioma;
    }

    setFormato(formato) {
        this.formato = formato;
    }

    toJSON() {
        return {
            id: this.id,
            filmeId: this.filmeId,
            salaId: this.salaId,
            dataHora: this.dataHora,
            preco: this.preco,
            idioma: this.idioma,
            formato: this.formato
        };
    }

    formatarData(data) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    }

    toString() {
        return `Sessão: Filme ID ${this.filmeId} - Sala ID ${this.salaId} - Data: ${this.formatarData(this.dataHora)} - Preço: R$ ${this.preco.toFixed(2)} - ${this.idioma} - ${this.formato}`;
    }

    // Factory method
    static fromJSON(json) {
        return new Sessao(
            json.id,
            json.filmeId,
            json.salaId,
            json.dataHora,
            json.preco,
            json.idioma,
            json.formato
        );
    }
}
