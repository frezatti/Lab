import { Filme } from "../model/filme.js";
import { Ingresso } from "../model/ingresso.js";
import { Sessao } from "../model/sessao.js";
import { Sala } from "../model/sala.js";

export class IngressoController {
	constructor() {
		this.listaIngressos = [];
		this.listaSessoes = [];
		this.LOCAL_STORAGE_KEY = "ingressos";

		this.confirmarVenda = this.confirmarVenda.bind(this);
		this.excluir = this.excluir.bind(this);

		this.init();
	}

	init() {
		this.carregarDados();

		const btnConfirmarVenda = document.getElementById("btnConfirmarVenda");
		if (btnConfirmarVenda) {
			btnConfirmarVenda.addEventListener("click", this.confirmarVenda);
		}

		const params = new URLSearchParams(window.location.search);
		const sessaoId = params.get("sessaoId");
		if (sessaoId) {
			// Open the modal
			const modalEl = document.getElementById("modalVendaIngresso");
			if (modalEl) {
				const modal = new bootstrap.Modal(modalEl);
				modal.show();
			}
		}
	}

	carregarDados() {
		const filmesSalvos = localStorage.getItem("filmes");

		const ingressosSalvos = localStorage.getItem(this.LOCAL_STORAGE_KEY);
		if (ingressosSalvos) {
			try {
				const ingressosJSON = JSON.parse(ingressosSalvos);
				this.listaIngressos = ingressosJSON.map((json) =>
					Ingresso.fromJSON(json),
				);
			} catch (error) {
				console.error("Erro ao carregar ingressos do localStorage:", error);
				this.listaIngressos = [];
			}
		} else {
			this.listaIngressos = [];
		}

		if (filmesSalvos) {
			try {
				const filmesJSON = JSON.parse(filmesSalvos);
				this.listaFilmes = filmesJSON.map((json) => Filme.fromJSON(json));
			} catch (error) {
				console.error("Erro ao carregar filmes do localStorage:", error);
				this.listaFilmes = [];
			}
		} else {
			this.listaFilmes = [];
		}

		const salasSalvas = localStorage.getItem("salas");
		if (salasSalvas) {
			try {
				const salasJSON = JSON.parse(salasSalvas);
				this.listaSalas = salasJSON.map((json) => Sala.fromJSON(json));
			} catch (error) {
				console.error("Erro ao carregar salas do localStorage:", error);
				this.listaSalas = [];
			}
		} else {
			this.listaSalas = [];
		}

		const sessoesSalvas = localStorage.getItem("sessoes");
		if (sessoesSalvas) {
			try {
				const sessoesJSON = JSON.parse(sessoesSalvas);
				this.listaSessoes = sessoesJSON.map((json) => Sessao.fromJSON(json));
			} catch (error) {
				console.error("Erro ao carregar sessões do localStorage:", error);
				this.listaSessoes = [];
			}
		} else {
			this.listaSessoes = [];
		}

		this.preencherSelectSessao();
		this.atualizarTabela();

		const params = new URLSearchParams(window.location.search);
		const sessaoId = params.get("sessaoId");
		if (sessaoId) {
			const selectSessao = document.getElementById("sessao");
			if (selectSessao) selectSessao.value = sessaoId;
		}
	}

	preencherSelectSessao() {
		const selectSessao = document.getElementById("sessao");
		if (!selectSessao) return;

		selectSessao.innerHTML = '<option value="">Selecione uma sessão</option>';

		this.listaSessoes.forEach((sessao) => {
			// Find related movie and sala
			const filme = this.listaFilmes.find(
				(f) => String(f.id) === String(sessao.filmeId),
			);
			const sala = this.listaSalas.find(
				(s) => String(s.id) === String(sessao.salaId),
			);

			// Build descriptive text
			const filmeTitulo = filme ? filme.titulo : "Filme não encontrado";
			const salaNome = sala ? sala.nome : "Sala não encontrada";
			const dataHoraFormatada = this.formatarData(sessao.dataHora);

			const option = document.createElement("option");
			option.value = sessao.id;
			option.textContent = `${filmeTitulo} - ${salaNome} - ${dataHoraFormatada}`;
			selectSessao.appendChild(option);
		});
	}

	confirmarVenda() {
		const form = document.getElementById("formIngresso");
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const ingresso = this.criarIngressoDoFormulario();

		this.listaIngressos.push(ingresso);
		this.salvarNoLocalStorage();
		this.atualizarTabela();
		form.reset();
		const modal = bootstrap.Modal.getInstance(
			document.getElementById("modalVendaIngresso"),
		);
		if (modal) modal.hide();
	}

	criarIngressoDoFormulario() {
		return new Ingresso(
			Date.now(),
			document.getElementById("sessao").value,
			document.getElementById("nomeCliente").value.trim(),
			document.getElementById("cpf").value.trim(),
			document.getElementById("assento").value.trim(),
			document.getElementById("tipoPagamento").value,
		);
	}

	salvarNoLocalStorage() {
		localStorage.setItem(
			this.LOCAL_STORAGE_KEY,
			JSON.stringify(this.listaIngressos),
		);
	}

	atualizarTabela() {
		const tbody = document.getElementById("tabelaIngressos");
		if (!tbody) return;

		tbody.innerHTML = "";

		if (this.listaIngressos.length === 0) {
			const tr = document.createElement("tr");
			tr.innerHTML = `<td colspan="9" class="text-center">Nenhum ingresso vendido</td>`;
			tbody.appendChild(tr);
			return;
		}

		this.listaIngressos.forEach((ingresso) => {
			// Find the session for this ingresso
			const sessao = this.listaSessoes.find(
				(s) => String(s.id) === String(ingresso.sessaoId),
			);
			// Find the movie for the session
			let filmeTitulo = "Filme não encontrado";
			if (sessao && this.listaFilmes) {
				const filme = this.listaFilmes.find(
					(f) => String(f.id) === String(sessao.filmeId),
				);
				if (filme) {
					filmeTitulo = filme.titulo;
				}
			}

			const sessaoDescricao = sessao
				? this.formatarData(sessao.dataHora)
				: "Sessão não encontrada";

			const tr = document.createElement("tr");
			tr.innerHTML = `
      <td>${ingresso.id}</td>
      <td>${filmeTitulo}</td>
      <td>${sessaoDescricao}</td>
      <td>${ingresso.nomeCliente}</td>
      <td>${ingresso.cpf}</td>
      <td>${ingresso.assento}</td>
      <td>${ingresso.tipoPagamento}</td>
      <td>${this.formatarData(ingresso.dataCompra)}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-excluir" data-id="${ingresso.id}" title="Excluir ingresso">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
			tbody.appendChild(tr);

			tr.querySelector(".btn-excluir").addEventListener("click", () =>
				this.excluir(ingresso.id),
			);
		});
	}

	excluir(id) {
		this.listaIngressos = this.listaIngressos.filter(
			(ingresso) => ingresso.id !== id,
		);
		this.salvarNoLocalStorage();
		this.atualizarTabela();
	}

	formatarData(data) {
		try {
			const d = new Date(data);
			return (
				d.toLocaleDateString("pt-BR") +
				" " +
				d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
			);
		} catch {
			return data;
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	window.ingressoController = new IngressoController();
});
