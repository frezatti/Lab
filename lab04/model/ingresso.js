export class Ingresso {
    constructor(id, sessaoId, nomeCliente, cpf, assento, tipoPagamento) {
        this.id = id;
        this.sessaoId = sessaoId;
        this.nomeCliente = nomeCliente;
        this.cpf = cpf;
        this.assento = assento;
        this.tipoPagamento = tipoPagamento;
        this.dataCompra = new Date().toISOString();
    }

    // Getters
    getId() {
        return this.id;
    }

    getSessaoId() {
        return this.sessaoId;
    }

    getNomeCliente() {
        return this.nomeCliente;
    }

    getCpf() {
        return this.cpf;
    }

    getAssento() {
        return this.assento;
    }

    getTipoPagamento() {
        return this.tipoPagamento;
    }

    getDataCompra() {
        return this.dataCompra;
    }

    // Setters
    setId(id) {
        this.id = id;
    }

    setSessaoId(sessaoId) {
        this.sessaoId = sessaoId;
    }

    setNomeCliente(nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    setCpf(cpf) {
        this.cpf = cpf;
    }

    setAssento(assento) {
        this.assento = assento;
    }

    setTipoPagamento(tipoPagamento) {
        this.tipoPagamento = tipoPagamento;
    }

    setDataCompra(dataCompra) {
        this.dataCompra = dataCompra;
    }

    toJSON() {
        return {
            id: this.id,
            sessaoId: this.sessaoId,
            nomeCliente: this.nomeCliente,
            cpf: this.cpf,
            assento: this.assento,
            tipoPagamento: this.tipoPagamento,
            dataCompra: this.dataCompra
        };
    }

    formatarData(data) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
    }

    toString() {
        return `Ingresso: Sessão ID ${this.sessaoId} - Cliente: ${this.nomeCliente} - CPF: ${this.cpf} - Assento: ${this.assento} - Pagamento: ${this.tipoPagamento} - Compra: ${this.formatarData(this.dataCompra)}`;
    }

    // Factory method
    static fromJSON(json) {
        const ingresso = new Ingresso(
            json.id,
            json.sessaoId,
            json.nomeCliente,
            json.cpf,
            json.assento,
            json.tipoPagamento
        );
        ingresso.dataCompra = json.dataCompra;
        return ingresso;
    }
}
